import React, { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import CitySuggestions from './CitySuggestions'
import CurrentLocationButton from './CurrentLocationButton'

const WeatherSearch = ({ onSearch, onLocationSearch, loading }) => {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (city.trim().length >= 2) {
        fetchSuggestions(city.trim())
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [city])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (query) => {
    setSuggestionsLoading(true)
    try {
      // Use direct URL for development
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? `https://sky-now-teal.vercel.app/api/weather/suggestions?q=${encodeURIComponent(query)}`
        : `/api/weather/suggestions?q=${encodeURIComponent(query)}`
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const handleSuggestionSelect = (suggestion) => {
    setCity(suggestion.displayName)
    setShowSuggestions(false)
    // Use just the city name for the weather API, not the full display name
    onSearch(suggestion.name)
  }

  const handleInputChange = (e) => {
    setCity(e.target.value)
    if (e.target.value.trim().length >= 2) {
      setShowSuggestions(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city.trim())
      setShowSuggestions(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="weather-card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Check Weather</h2>
        <p className="text-gray-600 dark:text-gray-300">Search for any city worldwide to get current weather conditions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for any city worldwide..."
            className="search-input pl-10"
            disabled={loading}
            autoComplete="off"
          />
          
          <CitySuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            loading={suggestionsLoading}
            visible={showSuggestions}
            ref={suggestionsRef}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Get Weather</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Current Location Button */}
      <CurrentLocationButton 
        onLocationFound={onLocationSearch}
        loading={loading}
      />

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Start typing to see city suggestions from around the world</p>
        <p>Try: Paris, Tokyo, Sydney, New York, London, or any city name</p>
      </div>
    </div>
  )
}

export default WeatherSearch
