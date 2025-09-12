import React from 'react'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  CloudSnow,
  Zap,
  MapPin
} from 'lucide-react'

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null

  const { current, location } = weatherData

  // Weather code mapping for icons and descriptions
  const getWeatherInfo = (code) => {
    const weatherCodes = {
      0: { icon: Sun, description: 'Clear sky', color: 'text-yellow-500' },
      1: { icon: Sun, description: 'Mainly clear', color: 'text-yellow-500' },
      2: { icon: Cloud, description: 'Partly cloudy', color: 'text-gray-500' },
      3: { icon: Cloud, description: 'Overcast', color: 'text-gray-600' },
      45: { icon: Cloud, description: 'Foggy', color: 'text-gray-400' },
      48: { icon: Cloud, description: 'Depositing rime fog', color: 'text-gray-400' },
      51: { icon: CloudRain, description: 'Light drizzle', color: 'text-blue-500' },
      53: { icon: CloudRain, description: 'Moderate drizzle', color: 'text-blue-600' },
      55: { icon: CloudRain, description: 'Dense drizzle', color: 'text-blue-700' },
      61: { icon: CloudRain, description: 'Slight rain', color: 'text-blue-500' },
      63: { icon: CloudRain, description: 'Moderate rain', color: 'text-blue-600' },
      65: { icon: CloudRain, description: 'Heavy rain', color: 'text-blue-700' },
      71: { icon: Snowflake, description: 'Slight snow', color: 'text-blue-300' },
      73: { icon: Snowflake, description: 'Moderate snow', color: 'text-blue-400' },
      75: { icon: Snowflake, description: 'Heavy snow', color: 'text-blue-500' },
      77: { icon: CloudSnow, description: 'Snow grains', color: 'text-blue-300' },
      80: { icon: CloudRain, description: 'Slight rain showers', color: 'text-blue-500' },
      81: { icon: CloudRain, description: 'Moderate rain showers', color: 'text-blue-600' },
      82: { icon: CloudRain, description: 'Violent rain showers', color: 'text-blue-700' },
      85: { icon: CloudSnow, description: 'Slight snow showers', color: 'text-blue-300' },
      86: { icon: CloudSnow, description: 'Heavy snow showers', color: 'text-blue-400' },
      95: { icon: Zap, description: 'Thunderstorm', color: 'text-purple-600' },
      96: { icon: Zap, description: 'Thunderstorm with hail', color: 'text-purple-700' },
      99: { icon: Zap, description: 'Heavy thunderstorm with hail', color: 'text-purple-800' }
    }
    
    return weatherCodes[code] || { icon: Cloud, description: 'Unknown', color: 'text-gray-500' }
  }

  const weatherInfo = getWeatherInfo(current.weather_code)
  const WeatherIcon = weatherInfo.icon

  const formatTemperature = (temp) => {
    return `${Math.round(temp)}°C`
  }

  const formatWindSpeed = (speed) => {
    return `${Math.round(speed)} km/h`
  }

  const formatPressure = (pressure) => {
    return `${Math.round(pressure)} hPa`
  }

  const formatVisibility = (visibility) => {
    return `${Math.round(visibility / 1000)} km`
  }

  return (
    <div className="weather-card">
      {/* Location and Main Weather */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {location.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {location.country} • {location.admin1}
        </p>
        
        {/* Coordinates Display */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="font-mono">
              {Math.abs(location.latitude).toFixed(4)}°{location.latitude >= 0 ? 'N' : 'S'}, {Math.abs(location.longitude).toFixed(4)}°{location.longitude >= 0 ? 'E' : 'W'}
            </span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {location.timezone}
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <WeatherIcon className={`h-16 w-16 ${weatherInfo.color}`} />
          <div>
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">
              {formatTemperature(current.temperature_2m)}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300">
              {weatherInfo.description}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {current.relative_humidity_2m}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Humidity</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Wind className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatWindSpeed(current.wind_speed_10m)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Wind Speed</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Gauge className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatPressure(current.surface_pressure)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Pressure</div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatVisibility(current.visibility)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Visibility</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Feels like</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatTemperature(current.apparent_temperature)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">UV Index</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {current.uv_index || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Wind Direction</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {current.wind_direction_10m}°
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Precipitation</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {current.precipitation || 0} mm
            </span>
          </div>
        </div>
        
        {/* Detailed Coordinates */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Coordinates</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-gray-900 dark:text-gray-100">
                {Math.abs(location.latitude).toFixed(6)}°{location.latitude >= 0 ? 'N' : 'S'}
              </div>
              <div className="font-mono text-gray-900 dark:text-gray-100">
                {Math.abs(location.longitude).toFixed(6)}°{location.longitude >= 0 ? 'E' : 'W'}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Timezone: {location.timezone}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay
