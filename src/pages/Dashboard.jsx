'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Bar } from 'react-chartjs-2' // Changed from Line to Bar
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { AlertTriangle, ThermometerSun, Wind, Droplets, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchAllCitiesWeather } from '../api/weatherService'
import { calculateDailyStats, convertTemperature, checkThresholdBreach } from '../utils/dataProcessing'
import { saveDailySummary, saveAlert, getAlerts, getDailySummaries } from '../db/database'
import { Button } from '@/components/ui/button'

// Register chart components for Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']
const UPDATE_INTERVAL = 300000 // 5 minutes

function Dashboard() {
  const [selectedCity, setSelectedCity] = useState('Delhi')
  const [temperatureUnit, setTemperatureUnit] = useState('C')
  const [alertThreshold, setAlertThreshold] = useState(35)
  const [tempThreshold, setTempThreshold] = useState(35) 
  const [weatherData, setWeatherData] = useState({})
  const [alerts, setAlerts] = useState([])
  const [breaches, setBreaches] = useState([])
  const [dailySummaries, setDailySummaries] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleSetThreshold = () => {
    setAlertThreshold(tempThreshold)
  }

  // Fetch weather data
  const fetchWeatherUpdate = useCallback(async () => {
    try {
      const data = await fetchAllCitiesWeather(CITIES)
      setWeatherData(data)

      // Calculate and save daily summary
      const summary = calculateDailyStats(data)
      saveDailySummary(summary)

      // Check for threshold breaches
      const cityData = data[selectedCity]
      const { breaches: newBreaches, isAlerting } = checkThresholdBreach(
        cityData.temp,
        alertThreshold,
        breaches
      )

      setBreaches(newBreaches)

      if (isAlerting) {
        const alertMessage = `Temperature in ${selectedCity} (${cityData.temp}°C) exceeds threshold of ${alertThreshold}°C!`
        saveAlert({ message: alertMessage, city: selectedCity, temperature: cityData.temp })
        setAlerts(prev => [...prev, alertMessage])
      }

      setError(null)
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.')
      console.error('Error in weather update:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCity, alertThreshold])

  // Initial load
  useEffect(() => {
    fetchWeatherUpdate()
    const interval = setInterval(fetchWeatherUpdate, UPDATE_INTERVAL)
    setAlerts(getAlerts().map(alert => alert.message))
    setDailySummaries(getDailySummaries())

    return () => clearInterval(interval)
  }, [fetchWeatherUpdate])

  // Create chart data from daily summaries
  const chartData = {
    labels: Object.keys(dailySummaries),
    datasets: [
      {
        label: 'Average Temperature',
        data: Object.values(dailySummaries).map(summary => summary.averageTemperature),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Max Temperature',
        data: Object.values(dailySummaries).map(summary => summary.maximumTemperature),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      },
      {
        label: 'Min Temperature',
        data: Object.values(dailySummaries).map(summary => summary.minimumTemperature),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
    ],
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading weather data...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }


  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Weather Monitoring System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>City Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
  <CardHeader>
    <CardTitle>Temperature Unit</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center space-x-2">
      <Select value={temperatureUnit} onValueChange={setTemperatureUnit}>
        <SelectTrigger>
          <SelectValue placeholder="Select a temperature unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="C">Celsius</SelectItem>
          <SelectItem value="F">Fahrenheit</SelectItem>
          <SelectItem value="K">Kelvin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </CardContent>
</Card>


        <Card>
  <CardHeader>
    <CardTitle>Alert Threshold</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        value={tempThreshold}
        onChange={(e) => setTempThreshold(Number(e.target.value))}
        className="w-20"
      />
      <Label htmlFor="alert-threshold">°C</Label>
      <Button 
        onClick={handleSetThreshold}
        variant="default"
      >
        Set Threshold
      </Button>
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      Current threshold: {alertThreshold}°C
    </p>
  </CardContent>
</Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
  <CardHeader>
    <CardTitle>Current Weather</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="text-blue-500" />
          <span className="text-lg font-semibold">{selectedCity}</span>
        </div>
        <span className="text-2xl font-bold">
          {convertTemperature(weatherData[selectedCity]?.temp || 0, temperatureUnit)}°{temperatureUnit}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <ThermometerSun className="text-orange-500" />
          <span>Feels Like: {convertTemperature(weatherData[selectedCity]?.feels_like || 0, temperatureUnit)}°{temperatureUnit}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="text-blue-500" />
          <span>Humidity: {weatherData[selectedCity]?.humidity || 0}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="text-green-500" />
          <span>Wind: {weatherData[selectedCity]?.wind_speed || 0} m/s</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Condition:</span>
          <span>{weatherData[selectedCity]?.main || 'N/A'}</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>


        <Card>
  <CardHeader>
    <CardTitle>Alerts</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="max-h-[150px] overflow-y-auto pr-2">
      {alerts.length > 0 ? (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No active alerts</p>
      )}
    </div>
  </CardContent>
</Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Weather Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Temperature Trends',
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard