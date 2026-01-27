"""
Flask Web Server for AI Travel Planner with REST API endpoints.
"""
import asyncio
import uuid
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agents.root import root_agent
import os
from functools import wraps

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'travel-planner-secret-key-' + str(uuid.uuid4()))
CORS(app)

# Initialize the runner with root agent
session_service = InMemorySessionService()
runner = Runner(
    app_name="travel_planner",
    agent=root_agent,
    session_service=session_service
)

# Store active sessions
active_sessions = {}


def async_route(f):
    """Decorator to handle async routes in Flask."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(f(*args, **kwargs))
        finally:
            loop.close()
    return wrapper


async def retry_async(func, max_retries=3, delay=1):
    """Retry an async function with exponential backoff."""
    last_error = None
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            last_error = e
            if attempt < max_retries - 1:
                await asyncio.sleep(delay * (2 ** attempt))
                print(f"[!] Retry attempt {attempt + 1}/{max_retries} after error: {str(e)}")
    raise last_error


@app.route('/')
def index():
    """Serve the main web interface."""
    return render_template('index.html')


@app.route('/api/chat', methods=['POST'])
@async_route
async def chat():
    """Handle chat messages from the frontend."""
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create session for this user
        client_id = session.get('client_id')
        if not client_id:
            client_id = str(uuid.uuid4())
            session['client_id'] = client_id
        
        # Get or create session IDs
        if client_id not in active_sessions:
            user_id = "user_" + str(uuid.uuid4())
            session_id = "session_" + str(uuid.uuid4())
            
            # Create the session
            await session_service.create_session(
                app_name="travel_planner",
                user_id=user_id,
                session_id=session_id
            )
            
            active_sessions[client_id] = {
                'user_id': user_id,
                'session_id': session_id
            }
        
        user_id = active_sessions[client_id]['user_id']
        session_id = active_sessions[client_id]['session_id']
        
        # Create message content
        message = types.Content(
            role="user",
            parts=[types.Part(text=user_message)]
        )
        
        # Run the agent and collect response
        response_text = []
        try:
            async for event in runner.run_async(
                user_id=user_id,
                session_id=session_id,
                new_message=message
            ):
                if hasattr(event, 'content') and event.content:
                    for part in event.content.parts:
                        if hasattr(part, 'text') and part.text:
                            response_text.append(part.text)
        except Exception as e:
            error_msg = str(e)
            print(f"[!] Agent execution error: {error_msg}")
            import traceback
            traceback.print_exc()
            
            # Provide more helpful error message
            if "model" in error_msg.lower() or "not found" in error_msg.lower():
                response_text = ["Sorry, there's an issue with the AI model configuration. Please check the server logs."]
            elif "api" in error_msg.lower() or "key" in error_msg.lower() or "auth" in error_msg.lower():
                response_text = ["API authentication issue. Please check your GOOGLE_API_KEY in the .env file."]
            else:
                response_text = [f"I encountered an issue: {error_msg}. Please try rephrasing your query."]
        
        full_response = ''.join(response_text)
        
        if not full_response:
            full_response = "I couldn't generate a response. Please try again with a different query."
        
        return jsonify({
            'response': full_response,
            'session_id': client_id
        })
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request.'}), 500


@app.route('/api/reset', methods=['POST'])
@async_route
async def reset_session():
    """Reset the current chat session."""
    try:
        client_id = session.get('client_id')
        if client_id and client_id in active_sessions:
            # Get session info before deleting
            user_id = active_sessions[client_id]['user_id']
            session_id = active_sessions[client_id]['session_id']
            
            # Clean up ADK session (if method exists)
            try:
                if hasattr(session_service, 'delete_session'):
                    await session_service.delete_session(
                        app_name="travel_planner",
                        user_id=user_id,
                        session_id=session_id
                    )
            except Exception as cleanup_error:
                print(f"Session cleanup note: {cleanup_error}")
            
            # Remove from active sessions
            del active_sessions[client_id]
            session.pop('client_id', None)
        
        return jsonify({'message': 'Session reset successfully', 'status': 'fresh'})
    except Exception as e:
        print(f"Reset error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'AI Travel Planner'})


if __name__ == '__main__':
    # Check environment variables
    required_keys = ['GOOGLE_API_KEY', 'AMADEUS_CLIENT_ID', 'AMADEUS_CLIENT_SECRET', 'OPENWEATHER_API_KEY']
    missing_keys = [key for key in required_keys if not os.getenv(key)]
    
    if missing_keys:
        print("[X] Error: Missing required API keys:")
        for key in missing_keys:
            print(f"  - {key}")
        print("\nPlease check your .env file.")
    else:
        print("[*] Starting AI Travel Planner Web Server...")
        print("[*] Open your browser at: http://localhost:5000")
        app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)
