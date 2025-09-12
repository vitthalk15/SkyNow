import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import weatherRoutes from './routes/weather.js'
import config from './config.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = config.port

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}))
app.use(express.json())

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    console.log('⚠️  App will continue without database (search history won\'t be saved)')
    console.log('💡 To enable database features:')
    console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community')
    console.log('   2. Or use MongoDB Atlas: https://www.mongodb.com/atlas')
    console.log('   3. Update MONGODB_URI in server/config.js')
    // Don't exit the process, let the app run without database
  }
}

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/weather', weatherRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Weather API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Client URL: ${config.clientUrl}`)
  console.log(`🌐 API URL: http://localhost:${PORT}/api`)
})
