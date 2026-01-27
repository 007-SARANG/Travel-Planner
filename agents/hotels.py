from google.adk.agents import Agent
from agents.utils import get_amadeus_client

def search_hotels(city_code: str) -> str:
    """
    Finds hotels in a city using Amadeus API.
    Args: city_code: IATA city code (e.g., DEL for Delhi, BOM for Mumbai, PAR for Paris).
    """
    try:
        amadeus = get_amadeus_client()
        
        # Try hotel search by city code
        response = amadeus.shopping.hotel_offers_search.get(
            cityCode=city_code.upper(),
            adults=1,
            radius=50,
            radiusUnit='KM',
            ratings=['3', '4', '5'],
            bestRateOnly=True
        )

        if not response.data:
            return (
                f"No hotels found for IATA code '{city_code}'. "
                f"Common codes: DEL (Delhi), BOM (Mumbai), GOI (Goa), JAI (Jaipur), "
                f"BLR (Bangalore), MAA (Chennai), CCU (Kolkata)."
            )

        results = []
        for idx, offer in enumerate(response.data[:5], 1):
            hotel_info = offer.get('hotel', {})
            name = hotel_info.get('name', 'Unknown Hotel')
            
            # Get hotel details
            rating = hotel_info.get('rating', 'N/A')
            rating_str = f"{rating}/5" if rating != 'N/A' else 'Not rated'
            
            # Get price from first offer
            offers = offer.get('offers', [])
            if offers:
                price_info = offers[0].get('price', {})
                total = price_info.get('total', 'N/A')
                currency = price_info.get('currency', 'USD')
                price_str = f"{currency} {total}"
            else:
                price_str = "Price not available"
            
            results.append(f"{idx}. {name}\n   Rating: {rating_str} ⭐ | Price: {price_str}/night")

        header = f"🏨 Found {len(results)} hotel(s) in {city_code.upper()}:\n\n"
        return header + "\n\n".join(results) + "\n\n📌 Book via: Amadeus, Booking.com, Hotels.com"

    except Exception as e:
        error_msg = str(e)
        if "404" in error_msg or "not found" in error_msg.lower():
            return (
                f"Invalid IATA code: '{city_code}'. Use 3-letter airport codes.\n"
                f"Examples: DEL (Delhi), BOM (Mumbai), GOI (Goa), JAI (Jaipur), "
                f"BLR (Bangalore), MAA (Chennai), HYD (Hyderabad)."
            )
        elif "401" in error_msg or "authentication" in error_msg.lower():
            return "Amadeus API authentication failed. Check your credentials in .env file."
        else:
            return f"Hotel search error: {error_msg}"

hotel_agent = Agent(
    name="hotel_agent",
    model="gemini-1.5-flash",
    tools=[search_hotels],
    instruction=(
        "You search hotels using REAL Amadeus API data. "
        "ALWAYS use proper IATA city codes (3 letters): DEL for Delhi, BOM for Mumbai, GOI for Goa, etc. "
        "If user gives city name, convert it to IATA code first. "
        "Present results with ratings and prices. NO fake data."
    )
)