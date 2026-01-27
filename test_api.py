import os
import asyncio
from dotenv import load_dotenv
from amadeus import Client, Location  # Added explicit import
import aiohttp

load_dotenv()

def test_amadeus():
    print("Testing Amadeus API...")
    try:
        amadeus = Client(
            client_id=os.getenv('AMADEUS_CLIENT_ID'),
            client_secret=os.getenv('AMADEUS_CLIENT_SECRET')
        )
        # Use 'AIRPORT,CITY' string directly to avoid the 'ANY' attribute error
        response = amadeus.reference_data.locations.get(
            keyword='LON',
            subType='AIRPORT,CITY' 
        )
        print(f"✅ Amadeus Connection Successful! Found {len(response.data)} locations.")
    except Exception as e:
        print(f"❌ Amadeus Failed: {e}")

async def test_weather():
    print("\nTesting OpenWeatherMap API...")
    api_key = os.getenv('OPENWEATHER_API_KEY')
    url = f"https://api.openweathermap.org/data/2.5/weather?q=London&appid={api_key}"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status == 200:
                print("✅ Weather Connection Successful!")
            else:
                print(f"❌ Weather Failed: Status {resp.status}")

if __name__ == "__main__":
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ GOOGLE_API_KEY is missing in .env")
    else:
        print("✅ GOOGLE_API_KEY is present.")
        
    test_amadeus()
    asyncio.run(test_weather())