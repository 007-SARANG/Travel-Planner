import os
import aiohttp
from google.adk.agents import Agent

async def get_weather(city: str) -> str:
    """
    Fetches the current weather for a city using OpenWeatherMap.
    """
    api_key = os.getenv('OPENWEATHER_API_KEY')
    if not api_key:
        return "Error: OpenWeatherMap API key is missing."

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {'q': city, 'appid': api_key, 'units': 'metric'}

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    desc = data['weather'][0]['description']
                    temp = data['main']['temp']
                    return f"Current weather in {city}: {temp}°C, {desc}."
                return f"Could not fetch weather for {city}. (Status: {resp.status})"
                
    # FIX: Use the universal ClientError which catches all aiohttp-related issues
    except aiohttp.ClientError as e:
        return f"Weather API connection issue: {str(e)}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"


# Create Weather Agent
weather_agent = Agent(
    name="weather_agent",
    model="gemini-1.5-flash",
    tools=[get_weather],
    instruction=(
        "You provide weather information for travel destinations. "
        "Use the get_weather tool to fetch real-time weather data. "
        "Present the information clearly with temperature and conditions."
    )
)