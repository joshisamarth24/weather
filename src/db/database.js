// db/database.js

const DAILY_SUMMARIES_KEY = 'weather_daily_summaries'
const ALERTS_KEY = 'weather_alerts'

export function saveDailySummary(summary) {
  try {
    const existingSummaries = getDailySummaries()
    const date = new Date().toISOString().split('T')[0]
    
    existingSummaries[date] = summary
    localStorage.setItem(DAILY_SUMMARIES_KEY, JSON.stringify(existingSummaries))
    
    return true
  } catch (error) {
    console.error('Error saving daily summary:', error)
    return false
  }
}

export function getDailySummaries() {
  try {
    const summaries = localStorage.getItem(DAILY_SUMMARIES_KEY)
    return summaries ? JSON.parse(summaries) : {}
  } catch (error) {
    console.error('Error getting daily summaries:', error)
    return {}
  }
}

export function saveAlert(alert) {
  try {
    const alerts = getAlerts()
    alerts.push({ ...alert, timestamp: Date.now() })
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
    return true
  } catch (error) {
    console.error('Error saving alert:', error)
    return false
  }
}

export function getAlerts() {
  try {
    const alerts = localStorage.getItem(ALERTS_KEY)
    return alerts ? JSON.parse(alerts) : []
  } catch (error) {
    console.error('Error getting alerts:', error)
    return []
  }
}