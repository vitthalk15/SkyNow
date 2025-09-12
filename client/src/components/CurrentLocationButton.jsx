import React, { useState } from 'react'
import { MapPin, Loader2, AlertCircle } from 'lucide-react'

const CurrentLocationButton = ({ onLocationFound, loading }) => {
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setLocationLoading(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        onLocationFound(latitude, longitude)
        setLocationLoading(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        let errorMessage = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access and try again.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
          default:
            errorMessage = 'An unknown error occurred while retrieving location.'
            break
        }
        
        setError(errorMessage)
        setLocationLoading(false)
      },
      options
    )
  }

  const isLoading = locationLoading || loading

  return (
    <div className="space-y-2">
      <button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="btn-secondary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Getting Location...</span>
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5" />
            <span>Use Current Location</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>We'll use your current location to show local weather</p>
      </div>
    </div>
  )
}

export default CurrentLocationButton
