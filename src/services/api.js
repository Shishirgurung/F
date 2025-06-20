import axios from 'axios'

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const OPENSKY_API_URL = 'https://opensky-network.org/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// OpenSky Network API client
const openskyApi = axios.create({
  baseURL: OPENSKY_API_URL,
  timeout: 15000,
})

// Flight data API
export const flightAPI = {
  // Get live flights from OpenSky Network
  async getLiveFlights() {
    try {
      const response = await openskyApi.get('/states/all')
      
      if (!response.data || !response.data.states) {
        throw new Error('No flight data available')
      }

      // Transform OpenSky data to our format
      const flights = response.data.states
        .filter(state => state[5] && state[6]) // Filter out flights without lat/lng
        .slice(0, 500) // Increased limit for more realistic flight traffic
        .map((state, index) => {
          const callsign = state[1]?.trim() || `UNKNOWN${index}`
          const latitude = state[6]
          const longitude = state[5]
          const originalCountry = state[2]

          return {
            id: state[0] || `flight_${index}`,
            callsign: callsign,
            origin_country: determineCountry(originalCountry, callsign, latitude, longitude),
            time_position: state[3],
            last_contact: state[4],
            longitude: longitude,
            latitude: latitude,
            baro_altitude: state[7],
            on_ground: state[8],
            velocity: state[9],
            true_track: state[10],
            vertical_rate: state[11],
            sensors: state[12],
            geo_altitude: state[13],
            squawk: state[14],
            spi: state[15],
            position_source: state[16],
            // Additional fields we'll estimate
            aircraft: estimateAircraftType(callsign),
            airline: extractAirline(callsign),
            altitude: state[7] || state[13] || 0,
            heading: state[10] || 0
          }
        })

      return flights
    } catch (error) {
      console.error('Error fetching OpenSky data:', error)
      throw error
    }
  },

  // Get flight details by callsign
  async getFlightDetails(callsign) {
    try {
      const response = await api.get(`/flights/${callsign}`)
      return response.data
    } catch (error) {
      console.error('Error fetching flight details:', error)
      throw error
    }
  },

  // Get emissions data
  async getEmissionsData(timeframe = 'today') {
    try {
      const response = await api.get(`/emissions/${timeframe}`)
      return response.data
    } catch (error) {
      console.error('Error fetching emissions data:', error)
      throw error
    }
  },

  // Get airline statistics
  async getAirlineStats() {
    try {
      const response = await api.get('/airlines/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching airline stats:', error)
      throw error
    }
  },

  // Search flights
  async searchFlights(query) {
    try {
      const response = await api.get(`/flights/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error searching flights:', error)
      throw error
    }
  }
}

// Helper function to estimate aircraft type from callsign
function estimateAircraftType(callsign) {
  if (!callsign) return 'Unknown'
  
  const aircraftTypes = {
    'AA': 'B737', 'DL': 'A320', 'UA': 'B777', 'BA': 'A350',
    'LH': 'A320', 'AF': 'A350', 'KL': 'B787', 'EK': 'A380',
    'QR': 'A350', 'SQ': 'A350', 'CX': 'A350', 'JL': 'B787'
  }
  
  const airlineCode = callsign.substring(0, 2)
  return aircraftTypes[airlineCode] || ['B737', 'A320', 'B777', 'A350', 'B787'][Math.floor(Math.random() * 5)]
}

// Helper function to extract airline from callsign
function extractAirline(callsign) {
  if (!callsign) return 'Unknown'

  const airlines = {
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines',
    'JL': 'Japan Airlines',
    'NH': 'ANA',
    'CZ': 'China Southern',
    'CA': 'Air China',
    'MU': 'China Eastern',
    'AI': 'Air India',
    'TK': 'Turkish Airlines',
    'SU': 'Aeroflot',
    'AC': 'Air Canada',
    'WN': 'Southwest Airlines'
  }

  const airlineCode = callsign.substring(0, 2)
  return airlines[airlineCode] || 'Unknown Airline'
}

// Helper function to determine country from airline code or coordinates
function determineCountry(originalCountry, callsign, latitude, longitude) {
  // If OpenSky provides valid country data, use it
  if (originalCountry && originalCountry !== 'Unknown' && originalCountry.trim() !== '') {
    return originalCountry
  }

  // Map airline codes to countries
  const airlineCountries = {
    'AA': 'United States', 'DL': 'United States', 'UA': 'United States', 'WN': 'United States',
    'BA': 'United Kingdom', 'VS': 'United Kingdom',
    'LH': 'Germany', 'DE': 'Germany',
    'AF': 'France', 'TO': 'France',
    'KL': 'Netherlands',
    'EK': 'United Arab Emirates', 'FZ': 'United Arab Emirates',
    'QR': 'Qatar',
    'SQ': 'Singapore',
    'JL': 'Japan', 'NH': 'Japan',
    'CZ': 'China', 'CA': 'China', 'MU': 'China',
    'AI': 'India', '6E': 'India',
    'TK': 'Turkey',
    'SU': 'Russia',
    'AC': 'Canada', 'WJ': 'Canada',
    'AZ': 'Italy', 'FR': 'Ireland',
    'IB': 'Spain', 'VY': 'Spain',
    'TP': 'Portugal',
    'OS': 'Austria',
    'LX': 'Switzerland',
    'SK': 'Sweden', 'DY': 'Norway',
    'AY': 'Finland',
    'QF': 'Australia', 'JQ': 'Australia',
    'NZ': 'New Zealand',
    'SA': 'South Africa',
    'AM': 'Mexico', 'VB': 'Mexico',
    'LA': 'Chile', 'AR': 'Argentina',
    'G3': 'Brazil', 'JJ': 'Brazil'
  }

  if (callsign) {
    const airlineCode = callsign.substring(0, 2)
    if (airlineCountries[airlineCode]) {
      return airlineCountries[airlineCode]
    }
  }

  // Use geographic coordinates to determine country (simplified)
  if (latitude && longitude) {
    // North America
    if (latitude >= 25 && latitude <= 70 && longitude >= -170 && longitude <= -50) {
      if (latitude >= 49) return 'Canada'
      if (longitude >= -125) return 'United States'
      return 'United States'
    }
    // Europe
    if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 40) {
      if (latitude >= 54 && longitude >= -8 && longitude <= 2) return 'United Kingdom'
      if (latitude >= 47 && longitude >= 2 && longitude <= 8) return 'France'
      if (latitude >= 47 && longitude >= 8 && longitude <= 15) return 'Germany'
      return 'Europe'
    }
    // Asia
    if (latitude >= 10 && latitude <= 70 && longitude >= 60 && longitude <= 180) {
      if (longitude >= 100 && longitude <= 140 && latitude >= 20 && latitude <= 50) return 'China'
      if (longitude >= 130 && longitude <= 146 && latitude >= 30 && latitude <= 46) return 'Japan'
      if (longitude >= 68 && longitude <= 97 && latitude >= 8 && latitude <= 37) return 'India'
      return 'Asia'
    }
    // Middle East
    if (latitude >= 12 && latitude <= 42 && longitude >= 25 && longitude <= 65) {
      return 'Middle East'
    }
    // Australia/Oceania
    if (latitude >= -50 && latitude <= -10 && longitude >= 110 && longitude <= 180) {
      return 'Australia'
    }
  }

  return 'International'
}

// Weather API (for future enhancement)
export const weatherAPI = {
  async getWeatherData(lat, lng) {
    try {
      // This would integrate with a weather service
      // For now, return mock data
      return {
        temperature: 20,
        windSpeed: 15,
        windDirection: 270,
        visibility: 10
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
      throw error
    }
  }
}

export default api
