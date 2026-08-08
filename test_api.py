import os
import requests
from dotenv import load_dotenv
from amadeus import Client

load_dotenv(override=True)

def test_amadeus():
    print("Testing Amadeus API...")
    try:
        amadeus = Client(
            client_id=os.getenv('AMADEUS_CLIENT_ID'),
            client_secret=os.getenv('AMADEUS_CLIENT_SECRET')
        )
        response = amadeus.reference_data.locations.get(
            keyword='LON',
            subType='AIRPORT,CITY' 
        )
        print(f"✅ Amadeus Connection Successful! Found {len(response.data)} locations.")
    except Exception as e:
        print(f"❌ Amadeus Failed: {e}")

def test_weather():
    print("\nTesting OpenWeatherMap API...")
    api_key = os.getenv('OPENWEATHER_API_KEY')
    url = f"https://api.openweathermap.org/data/2.5/weather?q=London&appid={api_key}"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            print("✅ Weather Connection Successful!")
        else:
            print(f"❌ Weather Failed: Status {resp.status_code}")
    except Exception as e:
        print(f"❌ Weather Exception: {e}")

if __name__ == "__main__":
    if not os.getenv("OPENROUTER_API_KEY"):
        print("❌ OPENROUTER_API_KEY is missing in .env")
    else:
        print("✅ OPENROUTER_API_KEY is present.")
        
    test_amadeus()
    test_weather()