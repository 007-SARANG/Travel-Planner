"""
Flask Web Server for AI Travel Planner with REST API endpoints.
Uses OpenRouter API (OpenAI-compatible) for LLM inference.
"""
import os
import uuid
import time
import re
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
from agents.root import SYSTEM_PROMPT
from agents.weather import get_weather

# Load environment variables
load_dotenv(override=True)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'travel-planner-secret-key-' + str(uuid.uuid4()))
app.config['TEMPLATES_AUTO_RELOAD'] = True  # Force template reload
app.config['DEBUG'] = False
CORS(app)

# Initialize OpenRouter client lazily (avoids crash if key is missing at import time)
_openrouter_client = None

def get_openrouter_client():
    """Get or create the OpenRouter client."""
    global _openrouter_client
    if _openrouter_client is None:
        api_key = os.getenv("OPENROUTER_API_KEY", "")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set. Get a free key at https://openrouter.ai/keys")
        _openrouter_client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
    return _openrouter_client

# Model to use - "openrouter/auto" auto-routes to best available free model
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/auto")

# Store active conversations (client_id -> list of messages)
conversations = {}

# Rate limiting: track last request time per client
client_last_request = {}
MIN_REQUEST_INTERVAL = 3  # seconds between requests per client

# Max conversation history to keep (to avoid token limits)
MAX_HISTORY_MESSAGES = 20


def extract_destination(message: str) -> str:
    """Try to extract a destination/city name from the user message."""
    patterns = [
        r'to\s+([A-Za-z\s]+?)(?:\s+for|\s+from|\s+on|\s+in|\s*[,.]|\s*$)',
        r'(?:trip|travel|fly|go|visit|holiday|vacation)\s+to\s+([A-Za-z\s]+?)(?:\s+from|\s+on|\s+in|\s+for|\s*[,.]|\s*$)',
        r'(?:weather|climate)\s+(?:in|at|for)\s+([A-Za-z\s]+?)(?:\s+on|\s+in|\s+for|\s*[,.]|\s*$)',
        r'(?:plan|explore|discover)\s+([A-Za-z\s]+?)(?:\s+trip|\s+on|\s+in|\s+for|\s*[,.]|\s*$)',
        r'in\s+([A-Za-z\s]+?)(?:\s+for|\s*[,.]|\s*$)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            city = match.group(1).strip()
            # Clean common words
            words = city.split()
            filtered = [w for w in words if w.lower() not in ('the', 'a', 'an', 'my', 'our', 'for', 'days', 'day', 'trip', 'travelers', 'traveler')]
            city = " ".join(filtered).strip()
            if 2 <= len(city) <= 30:
                return city
    
    return ""


@app.route('/')
def index():
    """Serve the main web interface."""
    return render_template('index.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages from the frontend."""
    try:
        data = request.json or {}
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create session for this user
        client_id = session.get('client_id')
        if not client_id:
            client_id = str(uuid.uuid4())
            session['client_id'] = client_id
        
        # Per-client rate limiting to prevent burning through API quota
        now = time.time()
        last_req = client_last_request.get(client_id, 0)
        if now - last_req < MIN_REQUEST_INTERVAL:
            wait_time = int(MIN_REQUEST_INTERVAL - (now - last_req)) + 1
            return jsonify({
                'response': f"Please wait {wait_time} seconds before sending another request.",
                'session_id': client_id,
                'rate_limited': True,
                'retry_after': wait_time
            })
        client_last_request[client_id] = now
        
        # Initialize conversation history if new client
        if client_id not in conversations:
            conversations[client_id] = []
        
        # Determine destination and dates from payload or prompt
        destination = data.get('destination', '').strip() or extract_destination(user_message)
        budget_tier = data.get('budgetTier', '').strip()
        start_date = data.get('startDate', '').strip()
        
        # Fetch live weather & hotel options for destination
        context_blocks = []
        if start_date:
            context_blocks.append(f"[CONFIRMED TRIP DATES - Departing: {start_date}]")

        if destination:
            try:
                weather_data = get_weather(destination, forecast_days=5)
                if weather_data and "Error" not in weather_data and "Could not fetch" not in weather_data:
                    context_blocks.append(f"[WEATHER DATA - Real Live Forecast for {destination}]\n{weather_data}")
                else:
                    context_blocks.append(f"[WEATHER DATA - Estimated Conditions for {destination}]\nExpect pleasant seasonal travel temperatures around 25°C-30°C.")
            except Exception as e:
                print(f"[!] Weather fetch failed: {e}")
        
        # Build system content with injected context
        system_content = SYSTEM_PROMPT
        if context_blocks:
            system_content += "\n\n" + "\n\n".join(context_blocks)
        
        messages = [{"role": "system", "content": system_content}]
        
        # Add conversation history (trimmed to MAX_HISTORY_MESSAGES)
        history = conversations[client_id][-MAX_HISTORY_MESSAGES:]
        messages.extend(history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenRouter API with retry on rate limits
        max_retries = 3
        response_text = ""
        
        for attempt in range(max_retries):
            try:
                client = get_openrouter_client()
                completion = client.chat.completions.create(
                    model=OPENROUTER_MODEL,
                    messages=messages,
                    max_tokens=4096,
                    temperature=0.7,
                    extra_headers={
                        "HTTP-Referer": "https://tripwise.app",
                        "X-Title": "TripWise Travel Planner",
                    }
                )
                
                response_text = completion.choices[0].message.content or ""
                break
                
            except Exception as e:
                error_msg = str(e)
                is_rate_limit = (
                    "429" in error_msg
                    or "rate" in error_msg.lower()
                    or "quota" in error_msg.lower()
                    or "limit" in error_msg.lower()
                )
                
                if is_rate_limit and attempt < max_retries - 1:
                    wait_seconds = 2 ** (attempt + 1)  # 2s, 4s, 8s
                    print(f"[!] Rate limited (attempt {attempt + 1}/{max_retries}), retrying in {wait_seconds}s...")
                    time.sleep(wait_seconds)
                    continue
                
                # Final attempt failed or non-rate-limit error
                print(f"[!] OpenRouter API error: {error_msg}")
                
                if is_rate_limit:
                    response_text = "The AI service is experiencing high demand. Please wait a moment and try again."
                elif "api" in error_msg.lower() or "key" in error_msg.lower() or "auth" in error_msg.lower():
                    response_text = "API authentication issue. Please check your OPENROUTER_API_KEY in the .env file."
                else:
                    response_text = f"I encountered an issue: {error_msg}. Please try again."
                break
        
        if not response_text:
            response_text = "I couldn't generate a response. Please try again with a different query."
        
        # Save to conversation history
        conversations[client_id].append({"role": "user", "content": user_message})
        conversations[client_id].append({"role": "assistant", "content": response_text})
        
        # Trim history if too long
        if len(conversations[client_id]) > MAX_HISTORY_MESSAGES * 2:
            conversations[client_id] = conversations[client_id][-MAX_HISTORY_MESSAGES:]
        
        return jsonify({
            'response': response_text,
            'session_id': client_id
        })
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request.'}), 500


@app.route('/api/reset', methods=['POST'])
def reset_session():
    """Reset the current chat session."""
    try:
        client_id = session.get('client_id')
        if client_id and client_id in conversations:
            del conversations[client_id]
            session.pop('client_id', None)
        
        return jsonify({'message': 'Session reset successfully', 'status': 'fresh'})
    except Exception as e:
        print(f"Reset error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/health')
def health():
    """Health check endpoint."""
    api_key = os.getenv('OPENROUTER_API_KEY', '')
    has_key = bool(api_key and api_key != 'your_openrouter_api_key_here')
    return jsonify({
        'status': 'healthy',
        'service': 'TripWise Travel Planner',
        'llm_provider': 'OpenRouter',
        'model': OPENROUTER_MODEL,
        'api_key_configured': has_key
    })


if __name__ == '__main__':
    api_key = os.getenv('OPENROUTER_API_KEY', '')
    if not api_key or api_key == 'your_openrouter_api_key_here':
        print("[X] Error: Missing OPENROUTER_API_KEY!")
        print("    Get a free key at: https://openrouter.ai/keys")
        print("    Then add it to your .env file.")
    else:
        print(f"[*] Starting TripWise Travel Planner...")
        print(f"[*] LLM Provider: OpenRouter ({OPENROUTER_MODEL})")
        port = int(os.getenv('PORT', 5000))
        print(f"[*] Open your browser at: http://localhost:{port}")
        app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)
