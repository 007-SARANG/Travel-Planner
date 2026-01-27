import os
from amadeus import Client
from dotenv import load_dotenv

load_dotenv()

_amadeus_client = None

def get_amadeus_client() -> Client:
    """Singleton accessor for Amadeus client to prevent multiple authentications."""
    global _amadeus_client
    if _amadeus_client:
        return _amadeus_client
        
    client_id = os.getenv('AMADEUS_CLIENT_ID')
    client_secret = os.getenv('AMADEUS_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        raise ValueError("❌ Amadeus credentials missing! Check your .env file.")

    _amadeus_client = Client(client_id=client_id, client_secret=client_secret)
    return _amadeus_client