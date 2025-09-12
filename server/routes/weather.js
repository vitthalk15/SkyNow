import express from 'express'
import axios from 'axios'
import WeatherSearch from '../models/WeatherSearch.js'
import config from '../config.js'

const router = express.Router()

// Get weather data for a city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query

    if (!city) {
      return res.status(400).json({
        error: 'City parameter is required',
        message: 'Please provide a city name'
      })
    }

    // First, get coordinates for the city using geocoding
    const geocodingResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: city,
        count: 1,
        language: 'en'
      }
    })

    if (!geocodingResponse.data.results || geocodingResponse.data.results.length === 0) {
      return res.status(404).json({
        error: 'City not found',
        message: `No weather data available for "${city}"`
      })
    }

    const location = geocodingResponse.data.results[0]
    const { latitude, longitude } = location

    // Get current weather data
    const weatherResponse = await axios.get(`${config.openMeteoBaseUrl}/forecast`, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
        timezone: 'auto',
        forecast_days: 1
      }
    })

    const weatherData = {
      location: {
        name: location.name,
        country: location.country,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone
      },
      current: {
        ...weatherResponse.data.current,
        // Add default values for missing parameters
        surface_pressure: weatherResponse.data.current.surface_pressure || weatherResponse.data.current.pressure_msl,
        visibility: weatherResponse.data.current.visibility || 10000, // Default 10km visibility
        uv_index: weatherResponse.data.current.uv_index || 0
      },
      last_updated: new Date().toISOString()
    }

    // Save search to database (if MongoDB is available)
    try {
      if (mongoose.connection.readyState === 1) {
        const searchRecord = new WeatherSearch({
          city: location.name,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
          temperature: weatherResponse.data.current.temperature_2m,
          weatherCode: weatherResponse.data.current.weather_code,
          searchTimestamp: new Date()
        })
        
        await searchRecord.save()
      }
    } catch (dbError) {
      console.error('Database save error:', dbError.message)
      // Don't fail the request if database save fails
    }

    res.json(weatherData)

  } catch (error) {
    console.error('Weather API error:', error.message)
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    })
    
    if (error.response) {
      // API error
      res.status(error.response.status).json({
        error: 'Weather API error',
        message: error.response.data?.error || error.response.data?.reason || 'Failed to fetch weather data',
        details: error.response.data
      })
    } else if (error.request) {
      // Network error
      res.status(503).json({
        error: 'Service unavailable',
        message: 'Weather service is currently unavailable. Please try again later.'
      })
    } else {
      // Other error
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching weather data'
      })
    }
  }
})

// Get city suggestions for autocomplete
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.length < 2) {
      return res.json([])
    }

    const geocodingResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: q,
        count: 10,
        language: 'en'
      }
    })

    if (!geocodingResponse.data.results || geocodingResponse.data.results.length === 0) {
      return res.json([])
    }

    const suggestions = geocodingResponse.data.results.map(location => ({
      name: location.name,
      country: location.country,
      admin1: location.admin1,
      latitude: location.latitude,
      longitude: location.longitude,
      displayName: `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}`
    }))

    res.json(suggestions)

  } catch (error) {
    console.error('Suggestions API error:', error.message)
    res.json([]) // Return empty array on error
  }
})

// Get weather by coordinates (for current location)
router.get('/coordinates', async (req, res) => {
  try {
    const { latitude, longitude } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Coordinates required',
        message: 'Please provide latitude and longitude'
      })
    }

    // Create location object with coordinates
    // Note: Open-Meteo geocoding API doesn't support reverse geocoding
    // We'll use a simple fallback and let the weather API determine the timezone
    const location = {
      name: 'Current Location',
      country: 'Unknown',
      admin1: '',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: 'UTC' // Will be updated by weather API
    }

    // Get current weather data
    const weatherResponse = await axios.get(`${config.openMeteoBaseUrl}/forecast`, {
      params: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
        timezone: 'auto',
        forecast_days: 1
      }
    })

    const weatherData = {
      location: {
        name: location.name,
        country: location.country,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone
      },
      current: {
        ...weatherResponse.data.current,
        // Add default values for missing parameters
        surface_pressure: weatherResponse.data.current.surface_pressure || weatherResponse.data.current.pressure_msl,
        visibility: weatherResponse.data.current.visibility || 10000, // Default 10km visibility
        uv_index: weatherResponse.data.current.uv_index || 0
      },
      last_updated: new Date().toISOString()
    }

    // Save search to database (if MongoDB is available)
    try {
      if (mongoose.connection.readyState === 1) {
        const searchRecord = new WeatherSearch({
          city: location.name,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
          temperature: weatherResponse.data.current.temperature_2m,
          weatherCode: weatherResponse.data.current.weather_code,
          searchTimestamp: new Date()
        })
        
        await searchRecord.save()
      }
    } catch (dbError) {
      console.error('Database save error:', dbError.message)
      // Don't fail the request if database save fails
    }

    res.json(weatherData)

  } catch (error) {
    console.error('Weather coordinates API error:', error.message)
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    })
    
    if (error.response) {
      // API error
      res.status(error.response.status).json({
        error: 'Weather API error',
        message: error.response.data?.error || error.response.data?.reason || 'Failed to fetch weather data',
        details: error.response.data
      })
    } else if (error.request) {
      // Network error
      res.status(503).json({
        error: 'Service unavailable',
        message: 'Weather service is currently unavailable. Please try again later.'
      })
    } else {
      // Other error
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching weather data'
      })
    }
  }
})

// Get search history
router.get('/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([])
    }
    
    const { limit = 10 } = req.query
    
    const searches = await WeatherSearch
      .find()
      .sort({ searchTimestamp: -1 })
      .limit(parseInt(limit))
      .select('city country temperature weatherCode searchTimestamp')

    res.json(searches)
  } catch (error) {
    console.error('History fetch error:', error.message)
    res.status(500).json({
      error: 'Database error',
      message: 'Failed to fetch search history'
    })
  }
})

// Get weather statistics
router.get('/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        totalSearches: 0,
        uniqueCities: 0,
        recentSearches: 0,
        lastUpdated: new Date().toISOString(),
        databaseAvailable: false
      })
    }
    
    const totalSearches = await WeatherSearch.countDocuments()
    const uniqueCities = await WeatherSearch.distinct('city').length
    const recentSearches = await WeatherSearch
      .find({ searchTimestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
      .countDocuments()

    res.json({
      totalSearches,
      uniqueCities,
      recentSearches,
      lastUpdated: new Date().toISOString(),
      databaseAvailable: true
    })
  } catch (error) {
    console.error('Stats fetch error:', error.message)
    res.status(500).json({
      error: 'Database error',
      message: 'Failed to fetch statistics'
    })
  }
})

export default router
