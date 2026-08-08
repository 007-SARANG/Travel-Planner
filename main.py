"""
Main CLI entry point for the TripWise AI Travel Planner application using OpenRouter.
"""
import os
from dotenv import load_dotenv
from openai import OpenAI
from agents.root import SYSTEM_PROMPT

load_dotenv(override=True)

def main():
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ Error: OPENROUTER_API_KEY not found in .env")
        return

    print("✈️  Starting TripWise AI Travel Planner (OpenRouter powered)...")
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    print(f"✅ Session Started. Type 'quit' to exit.")

    while True:
        try:
            user_text = input("\nYou: ").strip()
            if not user_text:
                continue
            if user_text.lower() in ["quit", "exit"]:
                print("👋 Safe travels!")
                break

            messages.append({"role": "user", "content": user_text})
            print("🤖 TripWise:", end=" ", flush=True)

            response = client.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL", "openrouter/auto"),
                messages=messages,
                extra_headers={
                    "HTTP-Referer": "https://tripwise.app",
                    "X-Title": "TripWise Travel Planner",
                }
            )

            reply = response.choices[0].message.content or ""
            print(reply)
            messages.append({"role": "assistant", "content": reply})

        except KeyboardInterrupt:
            print("\n👋 Force exit.")
            break
        except Exception as e:
            print(f"\n❌ Runtime Error: {e}")

if __name__ == "__main__":
    main()