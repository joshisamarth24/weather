# Real-Time Weather Monitoring System

A React-based application that provides real-time weather monitoring and analysis for major Indian metropolitan cities using the OpenWeatherMap API. The system features daily weather summaries, configurable alerts, and interactive visualizations.

## Live Demo

🌐 [Weather Monitoring System]()

Try out the live application to explore all features and functionalities.

## Features

- Real-time weather monitoring for 6 major Indian metros (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad)
- Temperature conversion and customizable units (Celsius/Fahrenheit)
- Daily weather summaries with statistical analysis:
  - Average, maximum, and minimum temperatures
  - Dominant weather conditions
  - Temperature trends visualization
- Configurable alert system for weather conditions
- Interactive visualizations using Chart.js for weather trends
- Data persistence for historical analysis

## Tech Stack

- React.js (Frontend Framework)
- Node.js (>=14.0.0)
- OpenWeatherMap API
- Chart.js (Data Visualization)
- Tailwind CSS (Styling)
- Local Storage (Data Persistence)

## Prerequisites

Before running this application, make sure you have:

1. Node.js installed (version 14 or higher)
2. npm
3. OpenWeatherMap API key ([Get it here](https://openweathermap.org/api))
4. Modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/anmol983/weather-monitoring-system.git
cd weather-monitoring-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:5173`

## API Usage

The application uses the following OpenWeatherMap API endpoints:
- Current Weather Data: `/data/2.5/weather`

## Known Limitations

- Weather data update frequency is limited by the API's free tier rate limits
- Historical data storage is limited by Local Storage capacity
- Alerts are currently only displayed in-app (no email notifications)

## Future Improvements

- [ ] Add email notification system for alerts
- [ ] Implement data export functionality
- [ ] Add more weather parameters (humidity, wind speed, etc.)
- [ ] Enhance Chart.js visualizations with more interactive features
- [ ] Add user authentication system

## Acknowledgments

- OpenWeatherMap API for providing weather data
- Chart.js community for excellent documentation and resources
- React community for excellent documentation and resources