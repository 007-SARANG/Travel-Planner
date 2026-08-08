import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(override=True)

def check_openrouter_connection():
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ No OPENROUTER_API_KEY found in .env")
        return

    print(f"Connecting with key ending in ...{api_key[-5:]}")
    client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)

    try:
        models = client.models.list()
        print("\n=== OPENROUTER CONNECTION OK ===")
        print(f"Total models available: {len(models.data)}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_openrouter_connection()