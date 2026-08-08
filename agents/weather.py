import os
import requests


def get_weather(city: str, forecast_days: int = 1) -> str:
    """
    Fetches weather for a city. 
    If forecast_days > 1, returns a multi-day forecast.
    Max forecast_days is 5 (free tier limit).
    """
    api_key = os.getenv('OPENWEATHER_API_KEY')
    if not api_key:
        return "Error: OpenWeatherMap API key is missing."

    try:
        if forecast_days <= 1:
            # Current weather
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {'q': city, 'appid': api_key, 'units': 'metric'}
            resp = requests.get(url, params=params, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                desc = data['weather'][0]['description']
                temp = data['main']['temp']
                feels = data['main']['feels_like']
                humidity = data['main']['humidity']
                return f"Current weather in {city}: {temp}°C (feels like {feels}°C), {desc}, humidity {humidity}%"
            return f"Could not fetch weather for {city}. (Status: {resp.status_code})"
        else:
            # 5-day forecast (3-hour intervals)
            url = "https://api.openweathermap.org/data/2.5/forecast"
            params = {'q': city, 'appid': api_key, 'units': 'metric'}
            resp = requests.get(url, params=params, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                forecasts = []
                days_seen = set()
                
                for item in data['list']:
                    date = item['dt_txt'].split(' ')[0]
                    if date not in days_seen and len(days_seen) < min(forecast_days, 5):
                        days_seen.add(date)
                        temp = item['main']['temp']
                        desc = item['weather'][0]['description']
                        forecasts.append(f"{date}: {temp}°C, {desc}")
                
                forecast_text = "\n".join(forecasts)
                return f"Weather forecast for {city}:\n{forecast_text}"
            return f"Could not fetch forecast for {city}. (Status: {resp.status_code})"
                
    except requests.RequestException as e:
        return f"Weather API connection issue: {str(e)}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"