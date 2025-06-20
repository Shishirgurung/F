// Vercel API Service - Works automatically in production!
// No need for npm run dev or server setup

class VercelAPI {
  constructor() {
    // Automatically detect if we're in development or production
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? '' // In production, use relative URLs (same domain)
      : 'http://localhost:3001' // In development, use dev server
  }

  // Get all flights from Vercel serverless function
  async getFlights() {
    try {
      console.log('🚀 Fetching flights from Vercel API...')
      
      const response = await fetch(`${this.baseURL}/api/flights`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ Fetched ${data.count} flights from Vercel API`)
        return data.data
      } else {
        throw new Error(data.error || 'Failed to fetch flights')
      }
    } catch (error) {
      console.error('❌ Vercel API Error:', error)
      throw error
    }
  }

  // Get emissions data from Vercel serverless function
  async getEmissions(timeframe = 'today') {
    try {
      console.log(`🌍 Fetching ${timeframe} emissions from Vercel API...`)
      
      const response = await fetch(`${this.baseURL}/api/emissions?timeframe=${timeframe}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ Fetched ${timeframe} emissions: ${data.data} tons`)
        return data.data
      } else {
        throw new Error(data.error || 'Failed to fetch emissions')
      }
    } catch (error) {
      console.error('❌ Vercel Emissions API Error:', error)
      throw error
    }
  }

  // Health check for Vercel API
  async healthCheck() {
    try {
      console.log('🔍 Checking Vercel API health...')
      
      const response = await fetch(`${this.baseURL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Health Check Failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Vercel API is healthy:', data.status)
      return data
    } catch (error) {
      console.error('❌ Vercel API Health Check Failed:', error)
      throw error
    }
  }

  // Search flights (can be extended)
  async searchFlights(query) {
    try {
      // For now, get all flights and filter client-side
      // In production, you'd add a search API endpoint
      const flights = await this.getFlights()
      
      if (!query) return flights
      
      const searchTerm = query.toLowerCase()
      return flights.filter(flight => 
        flight.callsign?.toLowerCase().includes(searchTerm) ||
        flight.airline?.toLowerCase().includes(searchTerm) ||
        flight.aircraft?.toLowerCase().includes(searchTerm) ||
        flight.origin?.toLowerCase().includes(searchTerm) ||
        flight.destination?.toLowerCase().includes(searchTerm)
      )
    } catch (error) {
      console.error('❌ Search Error:', error)
      throw error
    }
  }

  // Get airline statistics
  async getAirlineStats() {
    try {
      const flights = await this.getFlights()
      const airlineStats = {}
      
      flights.forEach(flight => {
        const airline = flight.airline || 'Unknown'
        if (!airlineStats[airline]) {
          airlineStats[airline] = {
            name: airline,
            flightCount: 0,
            totalEmissions: 0,
            averageEmissions: 0
          }
        }
        
        airlineStats[airline].flightCount++
        airlineStats[airline].totalEmissions += flight.emissions?.co2 || 0
      })
      
      // Calculate averages
      Object.values(airlineStats).forEach(stat => {
        stat.averageEmissions = stat.totalEmissions / stat.flightCount
      })
      
      return Object.values(airlineStats)
    } catch (error) {
      console.error('❌ Airline Stats Error:', error)
      throw error
    }
  }
}

// Create singleton instance
const vercelAPI = new VercelAPI()

export default vercelAPI
