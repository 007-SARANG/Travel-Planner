# Project: AI Travel Planner (Real APIs)
# Framework: google-adk (Python)

## APIs & Credentials
1. **Gemini:** `GOOGLE_API_KEY`
2. **Amadeus (Flights/Hotels):** `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET` (Use `amadeus` pip library)
3. **OpenWeatherMap:** `OPENWEATHER_API_KEY`

## Library Reference (google-adk)
We are using the `google-adk` library. Use these specific patterns:
- Import: `from google.adk.agents import Agent`
- Import: `from google.adk.runners import Runner`
- Import: `from google.adk.sessions import InMemorySessionService`
- Definition: `agent = Agent(name="...", model="gemini-1.5-flash", tools=[...], instruction="...")`
- Execution: `runner = Runner(agent=root_agent, session_service=InMemorySessionService())`
- A2A: To connect agents, register sub-agents as tools for the root agent.

## Agent Responsibilities
1. **WeatherAgent:** Calls OpenWeatherMap API for `get_weather(city)`.
2. **FlightAgent:** Calls `amadeus.shopping.flight_offers_search.get` for `search_flights(origin, dest, date)`.
3. **HotelAgent:** Calls `amadeus.shopping.hotel_offers_search.get` for `Google Hotels(city)`.
4. **RootAgent:** The user-facing bot. It delegates to the above agents using A2A.