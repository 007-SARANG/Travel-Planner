"""
Main entry point for the AI Travel Planner application.
"""
import asyncio
import os
import uuid
from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agents.root import root_agent

# Load environment variables
load_dotenv()

async def main():
    # 1. Validation
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ Error: GOOGLE_API_KEY not found in .env")
        return

    print("✈️  Starting AI Travel Planner (ADK powered)...")
    
    # 2. Initialize the Runner
    # FIX: Added 'app_name="travel_planner"' which caused the previous error
    runner = Runner(
        agent=root_agent,
        app_name="travel_planner", 
        session_service=InMemorySessionService()
    )

    # 3. Session Setup
    user_id = "user_1"
    session_id = str(uuid.uuid4())

    # Create the session explicitly before running
    await runner.session_service.create_session(
        app_name="travel_planner",
        user_id=user_id,
        session_id=session_id
    )

    print(f"✅ Session Started. Type 'quit' to exit.")

    # 4. Main Chat Loop
    while True:
        try:
            user_text = input("\nYou: ")
            if user_text.lower() in ["quit", "exit"]:
                print("👋 Safe travels!")
                break

            message = types.Content(
                role="user",
                parts=[types.Part(text=user_text)]
            )

            print("🤖 Agent:", end=" ", flush=True)
            
            # Run the agent
            async for event in runner.run_async(
                user_id=user_id,
                session_id=session_id,
                new_message=message
            ):
                # Handle streaming response
                if hasattr(event, 'content') and event.content:
                    for part in event.content.parts:
                        if part.text:
                            print(part.text, end="", flush=True)
            print("")

        except KeyboardInterrupt:
            print("\n👋 Force exit.")
            break
        except Exception as e:
            print(f"\n❌ Runtime Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())