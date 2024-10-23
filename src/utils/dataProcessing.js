// utils/dataProcessing.js

export function calculateDailyStats(weatherData) {
    const temperatures = Object.values(weatherData).map(data => data.temp)
    const conditions = Object.values(weatherData).map(data => data.main)
    
    // Calculate temperature stats
    const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length
    const maxTemp = Math.max(...temperatures)
    const minTemp = Math.min(...temperatures)
    // Calculate dominant weather condition
    const conditionCounts = conditions.reduce((acc, condition) => {
      acc[condition] = (acc[condition] || 0) + 1
      return acc
    }, {})
    
    const dominantCondition = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0]
    
    return {
      averageTemperature: avgTemp.toFixed(1),
      maximumTemperature: maxTemp.toFixed(1),
      minimumTemperature: minTemp.toFixed(1),
      dominantCondition,
      timestamp: Date.now()
    }
  }
  
  // Convert temperature function
export const convertTemperature = (temp, unit) => {
  if (unit === 'F') {
    return (temp * 9/5) + 32; // Celsius to Fahrenheit
  } else if (unit === 'K') {
    return temp + 273.15; // Celsius to Kelvin
  }
  return temp; // Celsius by default
}


  
  export function checkThresholdBreach(currentTemp, threshold, previousBreaches = []) {
    const NOW = Date.now()
    const FIVE_MINUTES = 5 * 60 * 1000
    
    // Clean up old breaches
    const recentBreaches = previousBreaches.filter(
      breach => NOW - breach.timestamp < FIVE_MINUTES
    )
    
    if (currentTemp > threshold) {
      recentBreaches.push({ timestamp: NOW, temperature: currentTemp })
    }
    
    // Check if we have two consecutive breaches within 5 minutes
    return {
      breaches: recentBreaches,
      isAlerting: currentTemp>threshold
    }
  }