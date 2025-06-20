import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import realFlightAPI from '../services/realFlightAPI'
import { calculateEmissions } from '../utils/emissionsCalculator'

const FlightDataContext = createContext()

export const useFlightData = () => {
  const context = useContext(FlightDataContext)
  if (!context) {
    throw new Error('useFlightData must be used within a FlightDataProvider')
  }
  return context
}

export const FlightDataProvider = ({ children }) => {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false) // Separate state for background updates
  const [error, setError] = useState(null)
  const [useRealData, setUseRealData] = useState(true) // Back to real data to debug
  const [dataSource, setDataSource] = useState('Loading...') // Track current data source
  const [totalEmissions, setTotalEmissions] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  })
  const [filters, setFilters] = useState({
    airline: '',
    aircraft: '',
    country: '',
    minDistance: 0,
    maxDistance: 20000
  })
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Flight tracking state
  const [trackedFlights, setTrackedFlights] = useState(() => {
    // Load tracked flights from localStorage on initialization
    try {
      const saved = localStorage.getItem('trackedFlights')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading tracked flights:', error)
      return []
    }
  })

  // Fetch flight data
  const fetchFlights = useCallback(async (isBackgroundUpdate = false) => {
    try {
      // Only show loading spinner for initial load, not background updates
      if (!isBackgroundUpdate) {
        setLoading(true)
      } else {
        setIsUpdating(true)
      }
      setError(null)

      let flightData = []
      let currentDataSource = 'Demo'

      if (useRealData) {
        try {
          console.log('🌍 Fetching REAL live flight data from OpenSky Network...')
          flightData = await realFlightAPI.getLiveFlights()
          currentDataSource = 'OpenSky Network (Real-time)'

          if (flightData.length === 0) {
            console.warn('⚠️ OpenSky Network returned no flight data - this could be due to low traffic or API restrictions')
            // Provide a small sample to show the app is working
            flightData = realFlightAPI.generateLimitedRealSample()
            currentDataSource = 'OpenSky Network (Limited Sample - API Restricted)'
            console.log(`✅ Generated ${flightData.length} sample flights as fallback`)
          }
        } catch (realApiError) {
          console.error('❌ OpenSky Network API failed:', realApiError.message)

          // The API will automatically provide realistic sample when all methods fail
          flightData = await realFlightAPI.getLiveFlights() // This will use the realistic sample fallback
          currentDataSource = 'OpenSky Network (Realistic Sample - API Temporarily Unavailable)'
          console.log(`✅ Generated ${flightData.length} realistic flights as API fallback`)
        }
      } else {
        console.log('🎭 Using demo flight data (development mode only)')
        flightData = generateDemoFlights()
        currentDataSource = 'Demo (Development mode)'
      }

      // For demo data, calculate emissions. Real data already has emissions calculated
      const flightsWithEmissions = flightData.map(flight => ({
        ...flight,
        emissions: flight.emissions || calculateEmissions(flight)
      }))

      setFlights(flightsWithEmissions)
      setDataSource(currentDataSource)
      setLastUpdate(new Date())

      // Calculate total emissions
      const todayEmissions = flightsWithEmissions.reduce((sum, flight) => sum + (flight.emissions?.co2 || 0), 0)

      setTotalEmissions({
        today: todayEmissions,
        thisWeek: todayEmissions * 7, // Simplified calculation
        thisMonth: todayEmissions * 30 // Simplified calculation
      })

      console.log(`✅ Loaded ${flightsWithEmissions.length} flights from ${currentDataSource}`)

    } catch (err) {
      console.error('❌ Error fetching flights:', err)
      if (!isBackgroundUpdate) {
        setError(`Failed to fetch flight data: ${err.message}`)

        // Don't fall back to demo data - keep the application authentic
        setFlights([])
        setDataSource('Error - No data available')
      }

    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false)
      } else {
        setIsUpdating(false)
      }
    }
  }, [useRealData])

  // Generate demo flight data for development
  const generateDemoFlights = () => {
    // Major airlines with realistic data
    const airlines = [
      { name: 'American Airlines', code: 'AA', fleet: ['B737', 'A320', 'B777', 'B787'] },
      { name: 'Delta Air Lines', code: 'DL', fleet: ['B737', 'A320', 'A350', 'B767'] },
      { name: 'United Airlines', code: 'UA', fleet: ['B737', 'A320', 'B777', 'B787'] },
      { name: 'Emirates', code: 'EK', fleet: ['A380', 'B777', 'A350'] },
      { name: 'Lufthansa', code: 'LH', fleet: ['A320', 'A350', 'B747', 'A380'] },
      { name: 'British Airways', code: 'BA', fleet: ['A320', 'B777', 'A350', 'A380'] },
      { name: 'Air France', code: 'AF', fleet: ['A320', 'A350', 'B777', 'A380'] },
      { name: 'Singapore Airlines', code: 'SQ', fleet: ['A350', 'A380', 'B777', 'B787'] },
      { name: 'Cathay Pacific', code: 'CX', fleet: ['A350', 'B777', 'A330'] },
      { name: 'Japan Airlines', code: 'JL', fleet: ['B737', 'B777', 'B787', 'A350'] },
      { name: 'Air Canada', code: 'AC', fleet: ['A320', 'B737', 'B777', 'B787'] },
      { name: 'KLM', code: 'KL', fleet: ['B737', 'A330', 'B777', 'B787'] },
      { name: 'Turkish Airlines', code: 'TK', fleet: ['A320', 'A330', 'B777', 'A350'] },
      { name: 'Qatar Airways', code: 'QR', fleet: ['A350', 'A380', 'B777', 'B787'] },
      { name: 'Southwest Airlines', code: 'WN', fleet: ['B737'] },
      { name: 'Ryanair', code: 'FR', fleet: ['B737'] },
      { name: 'easyJet', code: 'U2', fleet: ['A320'] },
      { name: 'China Southern', code: 'CZ', fleet: ['A320', 'B737', 'A330', 'B777'] },
      { name: 'China Eastern', code: 'MU', fleet: ['A320', 'B737', 'A330', 'B777'] },
      { name: 'IndiGo', code: '6E', fleet: ['A320'] },
      { name: 'AirAsia', code: 'AK', fleet: ['A320'] },
      { name: 'Qantas', code: 'QF', fleet: ['A330', 'B737', 'A380', 'B787'] },
      { name: 'LATAM Airlines', code: 'LA', fleet: ['A320', 'B737', 'B787'] },
      { name: 'Ethiopian Airlines', code: 'ET', fleet: ['B737', 'A350', 'B777', 'B787'] }
    ]

    // Comprehensive global airports with countries
    const airports = [
      // North America
      { name: 'New York JFK', lat: 40.6413, lng: -73.7781, country: 'United States' },
      { name: 'Los Angeles LAX', lat: 34.0522, lng: -118.2437, country: 'United States' },
      { name: 'Chicago ORD', lat: 41.9742, lng: -87.9073, country: 'United States' },
      { name: 'Dallas DFW', lat: 32.8968, lng: -97.0380, country: 'United States' },
      { name: 'Atlanta ATL', lat: 33.6407, lng: -84.4277, country: 'United States' },
      { name: 'Miami MIA', lat: 25.7959, lng: -80.2870, country: 'United States' },
      { name: 'San Francisco SFO', lat: 37.6213, lng: -122.3790, country: 'United States' },
      { name: 'Seattle SEA', lat: 47.4502, lng: -122.3088, country: 'United States' },
      { name: 'Boston BOS', lat: 42.3656, lng: -71.0096, country: 'United States' },
      { name: 'Las Vegas LAS', lat: 36.0840, lng: -115.1537, country: 'United States' },
      { name: 'Toronto YYZ', lat: 43.6777, lng: -79.6248, country: 'Canada' },
      { name: 'Vancouver YVR', lat: 49.1967, lng: -123.1815, country: 'Canada' },
      { name: 'Montreal YUL', lat: 45.4706, lng: -73.7408, country: 'Canada' },
      { name: 'Mexico City MEX', lat: 19.4363, lng: -99.0721, country: 'Mexico' },
      { name: 'Cancun CUN', lat: 21.0365, lng: -86.8771, country: 'Mexico' },

      // Europe
      { name: 'London Heathrow LHR', lat: 51.4700, lng: -0.4543, country: 'United Kingdom' },
      { name: 'London Gatwick LGW', lat: 51.1537, lng: -0.1821, country: 'United Kingdom' },
      { name: 'Paris CDG', lat: 49.0097, lng: 2.5479, country: 'France' },
      { name: 'Paris Orly ORY', lat: 48.7233, lng: 2.3794, country: 'France' },
      { name: 'Frankfurt FRA', lat: 50.0379, lng: 8.5622, country: 'Germany' },
      { name: 'Munich MUC', lat: 48.3537, lng: 11.7751, country: 'Germany' },
      { name: 'Berlin BER', lat: 52.3667, lng: 13.5033, country: 'Germany' },
      { name: 'Amsterdam AMS', lat: 52.3105, lng: 4.7683, country: 'Netherlands' },
      { name: 'Madrid MAD', lat: 40.4839, lng: -3.5680, country: 'Spain' },
      { name: 'Barcelona BCN', lat: 41.2974, lng: 2.0833, country: 'Spain' },
      { name: 'Rome FCO', lat: 41.8003, lng: 12.2389, country: 'Italy' },
      { name: 'Milan MXP', lat: 45.6306, lng: 8.7231, country: 'Italy' },
      { name: 'Zurich ZUR', lat: 47.4647, lng: 8.5492, country: 'Switzerland' },
      { name: 'Vienna VIE', lat: 48.1103, lng: 16.5697, country: 'Austria' },
      { name: 'Brussels BRU', lat: 50.9014, lng: 4.4844, country: 'Belgium' },
      { name: 'Copenhagen CPH', lat: 55.6181, lng: 12.6561, country: 'Denmark' },
      { name: 'Stockholm ARN', lat: 59.6519, lng: 17.9186, country: 'Sweden' },
      { name: 'Oslo OSL', lat: 60.1939, lng: 11.1004, country: 'Norway' },
      { name: 'Helsinki HEL', lat: 60.3172, lng: 24.9633, country: 'Finland' },
      { name: 'Warsaw WAW', lat: 52.1657, lng: 20.9671, country: 'Poland' },
      { name: 'Prague PRG', lat: 50.1008, lng: 14.2632, country: 'Czech Republic' },
      { name: 'Budapest BUD', lat: 47.4394, lng: 19.2611, country: 'Hungary' },
      { name: 'Athens ATH', lat: 37.9364, lng: 23.9445, country: 'Greece' },
      { name: 'Lisbon LIS', lat: 38.7813, lng: -9.1363, country: 'Portugal' },
      { name: 'Dublin DUB', lat: 53.4213, lng: -6.2701, country: 'Ireland' },
      { name: 'Istanbul IST', lat: 40.9769, lng: 28.8146, country: 'Turkey' },
      { name: 'Moscow SVO', lat: 55.9726, lng: 37.4146, country: 'Russia' },
      { name: 'St Petersburg LED', lat: 59.8003, lng: 30.2625, country: 'Russia' },

      // Asia Pacific
      { name: 'Tokyo Haneda HND', lat: 35.5494, lng: 139.7798, country: 'Japan' },
      { name: 'Tokyo Narita NRT', lat: 35.7720, lng: 140.3929, country: 'Japan' },
      { name: 'Osaka KIX', lat: 34.4347, lng: 135.2441, country: 'Japan' },
      { name: 'Beijing PEK', lat: 40.0799, lng: 116.6031, country: 'China' },
      { name: 'Shanghai PVG', lat: 31.1979, lng: 121.3364, country: 'China' },
      { name: 'Guangzhou CAN', lat: 23.3924, lng: 113.2988, country: 'China' },
      { name: 'Shenzhen SZX', lat: 22.6393, lng: 113.8107, country: 'China' },
      { name: 'Hong Kong HKG', lat: 22.3080, lng: 113.9185, country: 'Hong Kong' },
      { name: 'Seoul ICN', lat: 37.4602, lng: 126.4407, country: 'South Korea' },
      { name: 'Busan PUS', lat: 35.1795, lng: 128.9382, country: 'South Korea' },
      { name: 'Singapore SIN', lat: 1.3644, lng: 103.9915, country: 'Singapore' },
      { name: 'Bangkok BKK', lat: 13.6900, lng: 100.7501, country: 'Thailand' },
      { name: 'Kuala Lumpur KUL', lat: 2.7456, lng: 101.7072, country: 'Malaysia' },
      { name: 'Jakarta CGK', lat: -6.1256, lng: 106.6559, country: 'Indonesia' },
      { name: 'Manila MNL', lat: 14.5086, lng: 121.0194, country: 'Philippines' },
      { name: 'Ho Chi Minh SGN', lat: 10.8188, lng: 106.6519, country: 'Vietnam' },
      { name: 'Hanoi HAN', lat: 21.2187, lng: 105.8070, country: 'Vietnam' },
      { name: 'Sydney SYD', lat: -33.9399, lng: 151.1753, country: 'Australia' },
      { name: 'Melbourne MEL', lat: -37.6690, lng: 144.8410, country: 'Australia' },
      { name: 'Brisbane BNE', lat: -27.3942, lng: 153.1218, country: 'Australia' },
      { name: 'Perth PER', lat: -31.9403, lng: 115.9669, country: 'Australia' },
      { name: 'Auckland AKL', lat: -37.0082, lng: 174.7850, country: 'New Zealand' },
      { name: 'Delhi DEL', lat: 28.5562, lng: 77.1000, country: 'India' },
      { name: 'Mumbai BOM', lat: 19.0896, lng: 72.8656, country: 'India' },
      { name: 'Bangalore BLR', lat: 13.1986, lng: 77.7066, country: 'India' },
      { name: 'Chennai MAA', lat: 12.9941, lng: 80.1709, country: 'India' },
      { name: 'Kolkata CCU', lat: 22.6546, lng: 88.4467, country: 'India' },
      { name: 'Islamabad ISB', lat: 33.6149, lng: 73.0993, country: 'Pakistan' },
      { name: 'Karachi KHI', lat: 24.9056, lng: 67.1608, country: 'Pakistan' },
      { name: 'Dhaka DAC', lat: 23.8433, lng: 90.3978, country: 'Bangladesh' },
      { name: 'Kathmandu KTM', lat: 27.6966, lng: 85.3591, country: 'Nepal' },
      { name: 'Colombo CMB', lat: 7.1808, lng: 79.8841, country: 'Sri Lanka' },

      // Middle East
      { name: 'Dubai DXB', lat: 25.2532, lng: 55.3657, country: 'United Arab Emirates' },
      { name: 'Abu Dhabi AUH', lat: 24.4330, lng: 54.6511, country: 'United Arab Emirates' },
      { name: 'Doha DOH', lat: 25.2731, lng: 51.6080, country: 'Qatar' },
      { name: 'Kuwait KWI', lat: 29.2267, lng: 47.9689, country: 'Kuwait' },
      { name: 'Riyadh RUH', lat: 24.9576, lng: 46.6988, country: 'Saudi Arabia' },
      { name: 'Jeddah JED', lat: 21.6796, lng: 39.1565, country: 'Saudi Arabia' },
      { name: 'Tehran IKA', lat: 35.4161, lng: 51.1522, country: 'Iran' },
      { name: 'Tel Aviv TLV', lat: 32.0114, lng: 34.8867, country: 'Israel' },
      { name: 'Amman AMM', lat: 31.7226, lng: 35.9932, country: 'Jordan' },
      { name: 'Beirut BEY', lat: 33.8209, lng: 35.4884, country: 'Lebanon' },

      // Africa
      { name: 'Johannesburg JNB', lat: -26.1367, lng: 28.2411, country: 'South Africa' },
      { name: 'Cape Town CPT', lat: -33.9715, lng: 18.6021, country: 'South Africa' },
      { name: 'Cairo CAI', lat: 30.1219, lng: 31.4056, country: 'Egypt' },
      { name: 'Addis Ababa ADD', lat: 8.9806, lng: 38.7992, country: 'Ethiopia' },
      { name: 'Lagos LOS', lat: 6.5774, lng: 3.3212, country: 'Nigeria' },
      { name: 'Abuja ABV', lat: 9.0068, lng: 7.2631, country: 'Nigeria' },
      { name: 'Nairobi NBO', lat: -1.3192, lng: 36.9278, country: 'Kenya' },
      { name: 'Casablanca CMN', lat: 33.3675, lng: -7.5898, country: 'Morocco' },
      { name: 'Tunis TUN', lat: 36.8510, lng: 10.2272, country: 'Tunisia' },
      { name: 'Algiers ALG', lat: 36.6910, lng: 3.2155, country: 'Algeria' },
      { name: 'Accra ACC', lat: 5.6052, lng: -0.1668, country: 'Ghana' },
      { name: 'Dakar DKR', lat: 14.7397, lng: -17.4902, country: 'Senegal' },

      // South America
      { name: 'São Paulo GRU', lat: -23.4356, lng: -46.4731, country: 'Brazil' },
      { name: 'Rio de Janeiro GIG', lat: -22.8099, lng: -43.2505, country: 'Brazil' },
      { name: 'Brasília BSB', lat: -15.8697, lng: -47.9208, country: 'Brazil' },
      { name: 'Buenos Aires EZE', lat: -34.8222, lng: -58.5358, country: 'Argentina' },
      { name: 'Santiago SCL', lat: -33.3927, lng: -70.7854, country: 'Chile' },
      { name: 'Lima LIM', lat: -12.0219, lng: -77.1143, country: 'Peru' },
      { name: 'Bogotá BOG', lat: 4.7016, lng: -74.1469, country: 'Colombia' },
      { name: 'Caracas CCS', lat: 10.6013, lng: -66.9911, country: 'Venezuela' },
      { name: 'Quito UIO', lat: -0.1292, lng: -78.3575, country: 'Ecuador' },
      { name: 'La Paz LPB', lat: -16.5133, lng: -68.1925, country: 'Bolivia' },
      { name: 'Montevideo MVD', lat: -34.8384, lng: -56.0308, country: 'Uruguay' },
      { name: 'Asunción ASU', lat: -25.2398, lng: -57.5199, country: 'Paraguay' },

      // Central America & Caribbean
      { name: 'Panama City PTY', lat: 9.0714, lng: -79.3834, country: 'Panama' },
      { name: 'San José SJO', lat: 9.9939, lng: -84.2088, country: 'Costa Rica' },
      { name: 'Guatemala City GUA', lat: 14.5833, lng: -90.5275, country: 'Guatemala' },
      { name: 'Havana HAV', lat: 22.9892, lng: -82.4091, country: 'Cuba' },
      { name: 'Kingston KIN', lat: 17.9357, lng: -76.7875, country: 'Jamaica' },
      { name: 'Santo Domingo SDQ', lat: 18.4297, lng: -69.6689, country: 'Dominican Republic' },

      // Additional Asian Countries
      { name: 'Tashkent TAS', lat: 41.2579, lng: 69.2811, country: 'Uzbekistan' },
      { name: 'Almaty ALA', lat: 43.3521, lng: 77.0405, country: 'Kazakhstan' },
      { name: 'Baku GYD', lat: 40.4675, lng: 50.0467, country: 'Azerbaijan' },
      { name: 'Tbilisi TBS', lat: 41.6692, lng: 44.9547, country: 'Georgia' },
      { name: 'Yerevan EVN', lat: 40.1473, lng: 44.3959, country: 'Armenia' }
    ]

    return Array.from({ length: 500 }, (_, i) => {
      const airline = airlines[Math.floor(Math.random() * airlines.length)]
      const origin = airports[Math.floor(Math.random() * airports.length)]
      const destination = airports[Math.floor(Math.random() * airports.length)]
      const aircraft = airline.fleet[Math.floor(Math.random() * airline.fleet.length)]

      // Calculate realistic position between origin and destination
      const progress = Math.random()
      const lat = origin.lat + (destination.lat - origin.lat) * progress + (Math.random() - 0.5) * 2
      const lng = origin.lng + (destination.lng - origin.lng) * progress + (Math.random() - 0.5) * 2

      const flight = {
        id: `flight_${i}`,
        callsign: `${airline.code}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        latitude: lat,
        longitude: lng,
        altitude: Math.floor(Math.random() * 35000) + 15000,
        velocity: Math.floor(Math.random() * 200) + 400,
        heading: Math.floor(Math.random() * 360),
        aircraft: aircraft,
        origin: origin.name,
        destination: destination.name,
        origin_country: origin.country, // Add country information for demo flights
        airline: airline.name,
        passengers: aircraft === 'A380' ? Math.floor(Math.random() * 300) + 500 :
                   aircraft === 'B777' ? Math.floor(Math.random() * 200) + 300 :
                   aircraft === 'A350' ? Math.floor(Math.random() * 150) + 250 :
                   aircraft === 'B787' ? Math.floor(Math.random() * 100) + 200 :
                   Math.floor(Math.random() * 80) + 120
      }

      return {
        ...flight,
        emissions: calculateEmissions(flight)
      }
    })
  }

  // Filter flights based on current filters
  const filteredFlights = flights.filter(flight => {
    if (filters.airline && !flight.airline?.includes(filters.airline)) return false
    if (filters.aircraft && !flight.aircraft?.includes(filters.aircraft)) return false
    if (filters.country && !flight.origin?.includes(filters.country) && !flight.destination?.includes(filters.country)) return false
    return true
  })

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      airline: '',
      aircraft: '',
      country: '',
      minDistance: 0,
      maxDistance: 20000
    })
  }

  // Flight tracking functions
  const trackFlight = (flight) => {
    const trackingData = {
      ...flight,
      trackingStartTime: new Date().toISOString(),
      trackingId: `track_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      initialPosition: {
        latitude: flight.latitude,
        longitude: flight.longitude,
        altitude: flight.altitude
      },
      positionHistory: [{
        latitude: flight.latitude,
        longitude: flight.longitude,
        altitude: flight.altitude,
        timestamp: new Date().toISOString(),
        emissions: flight.emissions
      }],
      accumulatedEmissions: {
        co2: 0,
        fuelConsumption: 0,
        trackingDuration: 0 // in minutes
      }
    }

    setTrackedFlights(prev => {
      // Check if flight is already tracked
      const isAlreadyTracked = prev.some(tracked => tracked.id === flight.id)
      if (isAlreadyTracked) {
        return prev // Don't add duplicates
      }

      const updated = [...prev, trackingData]
      // Save to localStorage
      try {
        localStorage.setItem('trackedFlights', JSON.stringify(updated))
      } catch (error) {
        console.error('Error saving tracked flights:', error)
      }
      return updated
    })
  }

  const untrackFlight = (flightId) => {
    setTrackedFlights(prev => {
      const updated = prev.filter(tracked => tracked.id !== flightId)
      // Save to localStorage
      try {
        localStorage.setItem('trackedFlights', JSON.stringify(updated))
      } catch (error) {
        console.error('Error saving tracked flights:', error)
      }
      return updated
    })
  }

  const isFlightTracked = (flightId) => {
    return trackedFlights.some(tracked => tracked.id === flightId)
  }

  const updateTrackedFlights = useCallback(() => {
    setTrackedFlights(prev => {
      const updated = prev.map(trackedFlight => {
        // Find current flight data
        const currentFlight = flights.find(f => f.id === trackedFlight.id)
        if (!currentFlight) {
          return trackedFlight // Flight not found in current data
        }

        // Calculate tracking duration
        const startTime = new Date(trackedFlight.trackingStartTime)
        const now = new Date()
        const trackingDurationMinutes = Math.floor((now - startTime) / (1000 * 60))

        // Add new position to history
        const newPosition = {
          latitude: currentFlight.latitude,
          longitude: currentFlight.longitude,
          altitude: currentFlight.altitude,
          timestamp: now.toISOString(),
          emissions: currentFlight.emissions
        }

        // Calculate accumulated emissions based on tracking duration
        // Assume emissions are per hour, so calculate based on tracking time
        const trackingHours = trackingDurationMinutes / 60
        const emissionsRate = currentFlight.emissions?.co2 || 0 // tons per hour (estimated)
        const fuelRate = currentFlight.emissions?.fuelConsumption || 0 // tons per hour (estimated)

        const accumulatedCO2 = (emissionsRate / 24) * trackingHours // Rough calculation
        const accumulatedFuel = (fuelRate / 24) * trackingHours

        return {
          ...trackedFlight,
          // Update current position
          latitude: currentFlight.latitude,
          longitude: currentFlight.longitude,
          altitude: currentFlight.altitude,
          velocity: currentFlight.velocity,
          heading: currentFlight.heading,
          // Update emissions
          emissions: currentFlight.emissions,
          // Add to position history (keep last 100 positions)
          positionHistory: [
            ...trackedFlight.positionHistory.slice(-99),
            newPosition
          ],
          // Update accumulated emissions
          accumulatedEmissions: {
            co2: Math.max(0, accumulatedCO2),
            fuelConsumption: Math.max(0, accumulatedFuel),
            trackingDuration: trackingDurationMinutes
          },
          lastUpdate: now.toISOString()
        }
      })

      // Save updated tracked flights to localStorage
      try {
        localStorage.setItem('trackedFlights', JSON.stringify(updated))
      } catch (error) {
        console.error('Error saving tracked flights:', error)
      }

      return updated
    })
  }, [flights])

  // Initial data fetch
  useEffect(() => {
    fetchFlights(false) // Initial load with loading spinner

    // Adaptive refresh rate based on data source
    const refreshInterval = useRealData ? 120000 : 60000 // 2 minutes for real data, 1 minute for demo

    console.log(`🔄 Setting up auto-refresh every ${refreshInterval/1000} seconds (${useRealData ? 'Real' : 'Demo'} data)`)

    // Set up periodic background updates
    const interval = setInterval(() => {
      fetchFlights(true) // Background update without loading spinner
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchFlights, useRealData])

  // Update tracked flights separately every 30 seconds
  useEffect(() => {
    if (trackedFlights.length === 0) return

    const trackedInterval = setInterval(() => {
      updateTrackedFlights()
    }, 30000)

    return () => clearInterval(trackedInterval)
  }, [updateTrackedFlights, trackedFlights.length])

  // Update tracked flights when flight data changes (but only if we have tracked flights)
  useEffect(() => {
    if (flights.length > 0 && trackedFlights.length > 0) {
      updateTrackedFlights()
    }
  }, [flights, updateTrackedFlights])

  // Toggle between real and demo data
  const toggleDataSource = () => {
    setUseRealData(prev => !prev)
    // Immediately fetch new data with the new setting
    fetchFlights(false)
  }

  const value = {
    flights: filteredFlights,
    allFlights: flights,
    loading,
    isUpdating,
    error,
    totalEmissions,
    filters,
    lastUpdate,
    fetchFlights,
    updateFilters,
    clearFilters,
    // Data source management
    useRealData,
    dataSource,
    toggleDataSource,
    // Flight tracking
    trackedFlights,
    trackFlight,
    untrackFlight,
    isFlightTracked,
    updateTrackedFlights
  }

  return (
    <FlightDataContext.Provider value={value}>
      {children}
    </FlightDataContext.Provider>
  )
}
