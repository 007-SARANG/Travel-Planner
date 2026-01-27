import os
from dotenv import load_dotenv
from google.genai import Client

load_dotenv()

def check_available_models():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ No API Key found.")
        return

    client = Client(api_key=api_key)
    print(f"Connecting with key ending in ...{api_key[-5:]}")

    try:
        # Pager object in new SDK
        pager = client.models.list()
        
        print("\n=== AVAILABLE MODELS ===")
        found = False
        for model in pager:
            # We just access .name (universal) to avoid AttributeErrors
            # Some models come back as 'models/gemini-1.5-flash', etc.
            print(f"✅ {model.name}")
            found = True
            
        if not found:
            print("⚠️ No models found. Your API key might be restricted.")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_available_models()