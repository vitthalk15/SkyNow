import React from 'react'
import { History, Trash2, MapPin, Clock, Thermometer } from 'lucide-react'

const WeatherHistory = ({ history, onHistoryClick, onClearHistory }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const formatTemperature = (temp) => {
    return `${Math.round(temp)}°C`
  }

  const getWeatherDescription = (weatherCode) => {
    const weatherMap = {
      0: 'Clear', 1: 'Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
      45: 'Foggy', 48: 'Foggy',
      51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
      56: 'Light Freezing Drizzle', 57: 'Freezing Drizzle',
      61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
      66: 'Light Freezing Rain', 67: 'Freezing Rain',
      71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
      85: 'Light Snow Showers', 86: 'Snow Showers',
      95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Heavy Thunderstorm'
    }
    return weatherMap[weatherCode] || 'Unknown'
  }

  if (history.length === 0) {
    return (
      <div className="weather-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <History className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Search History</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2 text-gray-300 dark:text-gray-600">Search</div>
          <p className="text-gray-500 dark:text-gray-400">No searches yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Your recent weather searches will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="weather-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <History className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Searches</h3>
        </div>
        
        <button
          onClick={onClearHistory}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Clear history"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => onHistoryClick(item)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                  {item.city}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.country}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getWeatherDescription(item.weatherCode)}
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatTemperature(item.temperature)}
                </span>
              </div>
            </div>
            
            {/* Coordinates in history */}
            {item.latitude && item.longitude && (
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                {Math.abs(item.latitude).toFixed(4)}°{item.latitude >= 0 ? 'N' : 'S'}, {Math.abs(item.longitude).toFixed(4)}°{item.longitude >= 0 ? 'E' : 'W'}
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(item.timestamp)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Thermometer className="h-3 w-3" />
                <span>Feels like {formatTemperature(item.temperature)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click any search to check current weather
        </p>
      </div>
    </div>
  )
}

export default WeatherHistory
