// Vercel Serverless Function for Flight Data
// This runs automatically without npm run dev!

const AIRCRAFT_DATA = {
  'B737': { fuelBurnRate: 2.5, seatingCapacity: 180, emissionFactor: 3.16 },
  'A320': { fuelBurnRate: 2.4, seatingCapacity: 180, emissionFactor: 3.16 },
  'B777': { fuelBurnRate: 6.8, seatingCapacity: 350, emissionFactor: 3.16 },
  'A350': { fuelBurnRate: 5.8, seatingCapacity: 315, emissionFactor: 3.16 },
  'B787': { fuelBurnRate: 5.4, seatingCapacity: 290, emissionFactor: 3.16 },
  'A380': { fuelBurnRate: 11.9, seatingCapacity: 550, emissionFactor: 3.16 },
  'Unknown': { fuelBurnRate: 3.5, seatingCapacity: 200, emissionFactor: 3.16 }
}

function calculateEmissions(flight) {
  const aircraft = flight.aircraft || 'Unknown'
  const aircraftData = AIRCRAFT_DATA[aircraft] || AIRCRAFT_DATA['Unknown']
  
  const distance = Math.random() * 8000 + 500
  const flightTime = distance / 850
  const loadFactor = 0.8
  
  let adjustedFuelBurn = aircraftData.fuelBurnRate * (0.7 + (loadFactor * 0.3))
  const cruiseFactor = 0.85
  const takeoffLandingFactor = 1.5
  
  const cruiseTime = flightTime * cruiseFactor
  const takeoffLandingTime = flightTime * (1 - cruiseFactor)
  
  const cruiseFuel = cruiseTime * adjustedFuelBurn
  const takeoffLandingFuel = takeoffLandingTime * adjustedFuelBurn * takeoffLandingFactor
  const fuelConsumption = cruiseFuel + takeoffLandingFuel
  
  const co2Emissions = fuelConsumption * aircraftData.emissionFactor
  const passengers = Math.floor(aircraftData.seatingCapacity * loadFactor)
  const co2PerPassenger = co2Emissions / passengers
  
  return {
    co2: parseFloat(co2Emissions.toFixed(2)),
    co2PerPassenger: parseFloat(co2PerPassenger.toFixed(3)),
    fuelConsumption: parseFloat(fuelConsumption.toFixed(2)),
    distance: parseFloat(distance.toFixed(0)),
    flightTime: parseFloat(flightTime.toFixed(2)),
    passengers: passengers,
    aircraft: aircraft,
    emissionIntensity: parseFloat((co2Emissions / distance).toFixed(3))
  }
}

function generateDemoFlights() {
  const airlines = ['AA', 'DL', 'UA', 'BA', 'LH', 'AF', 'KL', 'EK', 'QR', 'SQ']
  const aircraftTypes = ['B737', 'A320', 'B777', 'A350', 'B787', 'A380']
  const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Frankfurt', lat: 50.1109, lng: 8.6821 }
  ]

  const airlineNames = {
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines'
  }

  return Array.from({ length: 100 }, (_, i) => {
    const origin = cities[Math.floor(Math.random() * cities.length)]
    const destination = cities[Math.floor(Math.random() * cities.length)]
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)]
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    
    const flight = {
      id: `api_${i}_${Date.now()}`,
      callsign: `${airline}${Math.floor(Math.random() * 9999)}`,
      latitude: origin.lat + (Math.random() - 0.5) * 10,
      longitude: origin.lng + (Math.random() - 0.5) * 10,
      altitude: Math.floor(Math.random() * 40000) + 10000,
      velocity: Math.floor(Math.random() * 300) + 200,
      heading: Math.floor(Math.random() * 360),
      aircraft: aircraft,
      origin: origin.name,
      destination: destination.name,
      airline: airlineNames[airline],
      origin_country: 'Global',
      dataSource: 'Vercel API (Auto-Generated)',
      timestamp: new Date().toISOString()
    }
    
    return {
      ...flight,
      emissions: calculateEmissions(flight)
    }
  })
}

// Main API Handler - Runs automatically on Vercel!
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    try {
      const flights = generateDemoFlights()
      
      res.status(200).json({
        success: true,
        data: flights,
        count: flights.length,
        timestamp: new Date().toISOString(),
        source: 'Vercel Serverless API'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate flight data',
        message: error.message
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }
}
