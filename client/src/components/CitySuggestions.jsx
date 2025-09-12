import React, { forwardRef } from 'react'
import { MapPin, Search } from 'lucide-react'

const CitySuggestions = forwardRef(({ suggestions, onSelect, loading, visible }, ref) => {
  if (!visible || suggestions.length === 0) {
    return null
  }

  return (
    <div ref={ref} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 z-50 max-h-64 overflow-y-auto transition-colors duration-300">
      {loading ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <Search className="h-4 w-4 animate-pulse" />
            <span>Searching cities...</span>
          </div>
        </div>
      ) : (
        <div className="py-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.displayName}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
})

CitySuggestions.displayName = 'CitySuggestions'

export default CitySuggestions
