import mongoose from 'mongoose'

const weatherSearchSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  weatherCode: {
    type: Number,
    required: true
  },
  searchTimestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
weatherSearchSchema.index({ city: 1, searchTimestamp: -1 })
weatherSearchSchema.index({ searchTimestamp: -1 })

// Virtual for formatted date
weatherSearchSchema.virtual('formattedDate').get(function() {
  return this.searchTimestamp.toLocaleDateString()
})

// Virtual for weather description
weatherSearchSchema.virtual('weatherDescription').get(function() {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Heavy thunderstorm with hail'
  }
  return weatherCodes[this.weatherCode] || 'Unknown'
})

// Ensure virtual fields are serialized
weatherSearchSchema.set('toJSON', { virtuals: true })
weatherSearchSchema.set('toObject', { virtuals: true })

const WeatherSearch = mongoose.model('WeatherSearch', weatherSearchSchema)

export default WeatherSearch
