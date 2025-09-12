import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import WeatherSearch from './components/WeatherSearch'
import WeatherDisplay from './components/WeatherDisplay'
import WeatherHistory from './components/WeatherHistory'
import ThemeToggle from './components/ThemeToggle'
import { Search, Cloud, Sun, CloudRain, Snowflake } from 'lucide-react'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  const handleWeatherSearch = async (city) => {
    setLoading(true)
    setError(null)
    
    try {
      // Try proxy first, fallback to direct URL
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
        : `/api/weather?city=${encodeURIComponent(city)}`
      
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`Weather data not found for ${city}`)
      }
      
      const data = await response.json()
      setWeatherData(data)
      
      // Add to search history
      const newSearch = {
        city: data.location.name,
        country: data.location.country,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        timestamp: new Date().toISOString(),
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code
      }
      
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item.city !== data.location.name)
        return [newSearch, ...filtered].slice(0, 10) // Keep only last 10 searches
      })
      
    } catch (err) {
      setError(err.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = async (latitude, longitude) => {
    setLoading(true)
    setError(null)
    
    try {
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? `http://localhost:5000/api/weather/coordinates?latitude=${latitude}&longitude=${longitude}`
        : `/api/weather/coordinates?latitude=${latitude}&longitude=${longitude}`
      
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error('Weather data not found for your location')
      }
      
      const data = await response.json()
      setWeatherData(data)
      
      // Add to search history
      const newSearch = {
        city: data.location.name,
        country: data.location.country,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        timestamp: new Date().toISOString(),
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code
      }
      
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item.city !== data.location.name)
        return [newSearch, ...filtered].slice(0, 10) // Keep only last 10 searches
      })
      
    } catch (err) {
      setError(err.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = (historyItem) => {
    handleWeatherSearch(historyItem.city)
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl transition-colors duration-300">
                  <Cloud className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">SkyNow</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Weather for Outdoor Enthusiasts</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Sun className="h-4 w-4" />
                  <span>Real-time weather data</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Section */}
          <div className="lg:col-span-2 space-y-6">
            <WeatherSearch 
              onSearch={handleWeatherSearch}
              onLocationSearch={handleLocationSearch}
              loading={loading}
            />
            
            {error && (
              <div className="weather-card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <CloudRain className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
                    <p className="text-red-600 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {weatherData && (
              <WeatherDisplay weatherData={weatherData} />
            )}
          </div>

          {/* History Section */}
          <div className="lg:col-span-1">
            <WeatherHistory 
              history={searchHistory}
              onHistoryClick={handleHistoryClick}
              onClearHistory={clearHistory}
            />
          </div>
        </div>
      </main>

        {/* Footer */}
        <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 mt-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              <p>Powered by Open-Meteo API • Built for outdoor enthusiasts</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
