"""
Ground Transportation Agent - Uses Gemini's Google Search grounding for REAL data.
Note: There's no reliable free API for Indian bus/train data. 
For production, integrate: Rome2Rio API, 12Go API, or IRCTC API (trains).
"""
from google.adk.agents import Agent


def search_ground_transport(origin_city: str, destination_city: str, departure_date: str) -> str:
    """
    Returns a prompt for AI to search for real bus/train data online.
    
    Args:
        origin_city: Departure city name.
        destination_city: Destination city name.
        departure_date: Date in YYYY-MM-DD format.
    
    Returns:
        Instruction for AI to search online for real transportation data.
    """
    return (
        f"USE GOOGLE SEARCH NOW to find REAL bus and train options from {origin_city} to {destination_city} "
        f"departing on or around {departure_date}. "
        f"Search these sites: RedBus.in, MakeMyTrip.com, IRCTC.co.in (trains), 12Go.asia, Rome2rio.com. "
        f"Extract ACTUAL prices, operators, timings, and durations from the search results. "
        f"Format as: Type | Operator | Price | Duration | Departure Time. "
        f"ONLY return data you found online - NO made-up information!"
    )


# Create the Ground Transport Agent  
transport_agent = Agent(
    name="transport_agent",
    model="gemini-2.0-flash-lite-preview-02-05",  # Has Google Search grounding
    tools=[search_ground_transport],
    instruction=(
        "You search for REAL bus and train data using Google Search. "
        "When search_ground_transport is called: "
        "1. Use your Google Search capability to find current information "
        "2. Look at RedBus.in, MakeMyTrip, IRCTC, 12Go, Rome2rio "
        "3. Extract ONLY real data from search results "
        "4. Present options with: Operator, Price (in INR), Duration, Timings "
        "5. If no results found, say 'Unable to find current data, check [websites]' "
        "\n"
        "NEVER make up data. Only use what you find via search."
    )
)
