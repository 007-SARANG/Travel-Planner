from google.adk.agents import Agent
from agents.utils import get_amadeus_client

def search_flights(origin_iata: str, destination_iata: str, departure_date: str) -> str:
    """
    Searches for flights using Amadeus.
    Args:
        origin_iata: 3-letter IATA code (e.g., JFK).
        destination_iata: 3-letter IATA code (e.g., LHR).
        departure_date: Date in YYYY-MM-DD format.
    """
    try:
        amadeus = get_amadeus_client()
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin_iata,
            destinationLocationCode=destination_iata,
            departureDate=departure_date,
            adults=1,
            max=5
        )

        if not response.data:
            return f"No flights found from {origin_iata} to {destination_iata} on {departure_date}."

        results = []
        for offer in response.data:
            price = offer['price']['total']
            airline = offer['validatingAirlineCodes'][0]
            segments = offer['itineraries'][0]['segments']
            duration = offer['itineraries'][0]['duration'][2:] # Strip 'PT'
            results.append(f"- Airline: {airline}, Price: {price} EUR, Duration: {duration}")
            
        return "\n".join(results)

    except Exception as e:
        return f"Flight search failed: {str(e)}"

flight_agent = Agent(
    name="flight_agent",
    model="gemini-1.5-flash",
    tools=[search_flights],
    instruction="You find flight options based on IATA codes."
)