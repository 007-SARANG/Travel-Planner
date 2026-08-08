"""
Ground Transportation - Returns search guidance for bus/train options.
Note: There's no reliable free API for Indian bus/train data. 
For production, integrate: Rome2Rio API, 12Go API, or IRCTC API (trains).
"""


def search_ground_transport(origin_city: str, destination_city: str, departure_date: str) -> str:
    """
    Returns a prompt for AI to provide bus/train data.
    
    Args:
        origin_city: Departure city name.
        destination_city: Destination city name.
        departure_date: Date in YYYY-MM-DD format.
    
    Returns:
        Instruction for AI to provide transportation data.
    """
    return (
        f"Provide real bus and train options from {origin_city} to {destination_city} "
        f"departing on or around {departure_date}. "
        f"Reference these sites: RedBus.in, MakeMyTrip.com, IRCTC.co.in (trains), 12Go.asia, Rome2rio.com. "
        f"Include ACTUAL prices, operators, timings, and durations. "
        f"Format as: Type | Operator | Price | Duration | Departure Time. "
        f"ONLY return data you know - NO made-up information!"
    )
