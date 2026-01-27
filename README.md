# AI Travel Planner 🌍✈️

A comprehensive AI-powered travel planning assistant with a beautiful web interface!

## Features ✨

- 🛫 **Flight Search** - Find the best flights using Amadeus API
- 🚂 **Train Options** - Search for train routes between cities
- 🚌 **Bus Routes** - Find bus services with pricing and schedules
- 🏨 **Hotel Bookings** - Discover hotels with ratings and prices
- ☁️ **Weather Information** - Real-time weather for your destination
- 🤖 **AI Assistant** - Intelligent trip planning with Google Gemini

## Two Ways to Use

### 1. Web Interface (Recommended) 🌐

Beautiful, modern web interface with a stunning gradient design!

**Start the web server:**
```bash
python app.py
```

Then open your browser at: **http://localhost:5000**

### 2. Command Line Interface 💻

Classic terminal-based chat interface.

**Run the CLI:**
```bash
python main.py
```

## Setup 🛠️

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure API keys:**

Copy `.env.template` to `.env` and add your API keys:
```env
GOOGLE_API_KEY=your_gemini_api_key
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret
OPENWEATHER_API_KEY=your_openweather_key
```

3. **Run the application:**

For web interface: `python app.py`
For CLI: `python main.py`

## Architecture 🏗️

```
Travel-Planner/
├── agents/
│   ├── weather.py      # Weather information agent
│   ├── flights.py      # Flight search agent
│   ├── hotels.py       # Hotel search agent
│   ├── transport.py    # Ground transport (buses/trains) agent
│   ├── root.py         # Main coordinator agent
│   └── utils.py        # Amadeus client initialization
├── templates/
│   └── index.html      # Web interface
├── static/
│   ├── css/style.css   # Beautiful gradient styling
│   └── js/app.js       # Frontend JavaScript
├── app.py              # Flask web server
├── main.py             # CLI application
└── requirements.txt    # Dependencies

```

## Example Queries 💬

- "Plan a trip from Delhi to Shimla for 3 days"
- "Find cheap travel options from Mumbai to Goa"
- "Show me bus and train options from Sirsa to Shimla"
- "What's the weather in Paris?"
- "Find luxury hotels in Jaipur"

## Technologies Used 🔧

- **Google ADK** - Agent framework
- **Google Gemini 2.0** - AI model
- **Amadeus API** - Flights & hotels
- **OpenWeatherMap** - Weather data
- **Flask** - Web server
- **HTML/CSS/JS** - Beautiful frontend

## Notes 📝

- Ground transport (buses/trains) uses simulated data. In production, integrate with APIs like Rome2Rio or Omio.
- The web interface features a stunning purple gradient design with smooth animations
- Both CLI and Web interfaces maintain conversation context

Enjoy planning your trips! 🎉
