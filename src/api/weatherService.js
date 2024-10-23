// api/weatherService.js

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function fetchWeatherData(city) {
  // Use import.meta.env instead of process.env for Vite
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city},IN&appid=${apiKey}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed')
    }
    
    const data = await response.json()
    
    return {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      main: data.weather[0].main,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      dt: data.dt,
      city: city
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

export async function fetchAllCitiesWeather(cities) {
  try {
    const promises = cities.map(city => fetchWeatherData(city))
    const results = await Promise.all(promises)
    return results.reduce((acc, data) => {
      acc[data.city] = data
      return acc
    }, {})
  } catch (error) {
    console.error('Error fetching all cities weather:', error)
    throw error
  }
}