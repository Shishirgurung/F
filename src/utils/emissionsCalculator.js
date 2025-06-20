// Aircraft emissions data based on ICAO and industry standards
const AIRCRAFT_DATA = {
  'B737': {
    fuelBurnRate: 2.5, // tons per hour
    seatingCapacity: 180,
    maxRange: 6570, // km
    emissionFactor: 3.16 // kg CO2 per kg fuel
  },
  'A320': {
    fuelBurnRate: 2.4,
    seatingCapacity: 180,
    maxRange: 6150,
    emissionFactor: 3.16
  },
  'B777': {
    fuelBurnRate: 6.8,
    seatingCapacity: 350,
    maxRange: 15700,
    emissionFactor: 3.16
  },
  'A350': {
    fuelBurnRate: 5.8,
    seatingCapacity: 315,
    maxRange: 15000,
    emissionFactor: 3.16
  },
  'B787': {
    fuelBurnRate: 5.4,
    seatingCapacity: 290,
    maxRange: 14800,
    emissionFactor: 3.16
  },
  'A380': {
    fuelBurnRate: 11.9,
    seatingCapacity: 550,
    maxRange: 15200,
    emissionFactor: 3.16
  },
  'B747': {
    fuelBurnRate: 10.8,
    seatingCapacity: 400,
    maxRange: 14200,
    emissionFactor: 3.16
  },
  'Unknown': {
    fuelBurnRate: 3.5, // Average
    seatingCapacity: 200,
    maxRange: 8000,
    emissionFactor: 3.16
  }
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

// Calculate flight time based on distance and average speed
export function calculateFlightTime(distance, averageSpeed = 850) {
  return distance / averageSpeed // hours
}

// Calculate fuel consumption for a flight
export function calculateFuelConsumption(aircraft, flightTime, loadFactor = 0.8) {
  const aircraftData = AIRCRAFT_DATA[aircraft] || AIRCRAFT_DATA['Unknown']
  
  // Base fuel burn rate adjusted for load factor and flight phase
  let adjustedFuelBurn = aircraftData.fuelBurnRate
  
  // Adjust for load factor (more passengers = more weight = more fuel)
  adjustedFuelBurn *= (0.7 + (loadFactor * 0.3))
  
  // Adjust for flight phase (takeoff and landing use more fuel)
  const cruiseFactor = 0.85 // 85% of flight time is cruise
  const takeoffLandingFactor = 1.5 // 50% more fuel during takeoff/landing
  
  const cruiseTime = flightTime * cruiseFactor
  const takeoffLandingTime = flightTime * (1 - cruiseFactor)
  
  const cruiseFuel = cruiseTime * adjustedFuelBurn
  const takeoffLandingFuel = takeoffLandingTime * adjustedFuelBurn * takeoffLandingFactor
  
  return cruiseFuel + takeoffLandingFuel
}

// Calculate CO2 emissions for a flight
export function calculateEmissions(flight) {
  try {
    const aircraft = flight.aircraft || 'Unknown'
    const aircraftData = AIRCRAFT_DATA[aircraft] || AIRCRAFT_DATA['Unknown']
    
    // Estimate flight distance (if not provided)
    let distance = flight.distance
    if (!distance && flight.origin && flight.destination) {
      // This would need actual airport coordinates
      // For now, use a random distance based on flight type
      distance = Math.random() * 8000 + 500 // 500-8500 km
    } else if (!distance) {
      // Use altitude and speed to estimate
      const altitude = flight.altitude || flight.baro_altitude || 35000
      const speed = flight.velocity || 500
      
      // Estimate based on typical flight patterns
      if (altitude > 30000) {
        distance = Math.random() * 6000 + 2000 // Long haul
      } else {
        distance = Math.random() * 2000 + 200 // Short/medium haul
      }
    }
    
    const flightTime = calculateFlightTime(distance)
    const fuelConsumption = calculateFuelConsumption(aircraft, flightTime)
    const co2Emissions = fuelConsumption * aircraftData.emissionFactor
    
    // Calculate per-passenger emissions
    const loadFactor = 0.8 // Assume 80% load factor
    const passengers = Math.floor(aircraftData.seatingCapacity * loadFactor)
    const co2PerPassenger = co2Emissions / passengers
    
    return {
      co2: parseFloat(co2Emissions.toFixed(2)), // Total CO2 in tons
      co2PerPassenger: parseFloat(co2PerPassenger.toFixed(3)), // CO2 per passenger in tons
      fuelConsumption: parseFloat(fuelConsumption.toFixed(2)), // Fuel in tons
      distance: parseFloat(distance.toFixed(0)), // Distance in km
      flightTime: parseFloat(flightTime.toFixed(2)), // Flight time in hours
      passengers: passengers,
      aircraft: aircraft,
      emissionIntensity: parseFloat((co2Emissions / distance).toFixed(3)) // kg CO2 per km
    }
  } catch (error) {
    console.error('Error calculating emissions:', error)
    return {
      co2: 0,
      co2PerPassenger: 0,
      fuelConsumption: 0,
      distance: 0,
      flightTime: 0,
      passengers: 0,
      aircraft: 'Unknown',
      emissionIntensity: 0
    }
  }
}

// Offset project types with different characteristics (FREE EDUCATIONAL VERSION)
const OFFSET_PROJECTS = {
  trees: {
    name: 'Tree Planting Awareness',
    description: 'Learn about reforestation projects and their impact',
    pricePerTon: 0, // FREE
    efficiency: 40, // trees per ton CO2
    timeframe: '20-30 years',
    icon: '🌳',
    color: 'green',
    benefits: ['Biodiversity', 'Soil protection', 'Local communities'],
    action: 'Learn & Share'
  },
  renewable: {
    name: 'Clean Energy Education',
    description: 'Discover renewable energy solutions',
    pricePerTon: 0, // FREE
    efficiency: 2.5, // MWh renewable energy per ton CO2
    timeframe: 'Immediate',
    icon: '⚡',
    color: 'blue',
    benefits: ['Clean energy', 'Job creation', 'Energy independence'],
    action: 'Explore Solutions'
  },
  carbonCapture: {
    name: 'Carbon Tech Awareness',
    description: 'Learn about carbon capture technology',
    pricePerTon: 0, // FREE
    efficiency: 1, // tons directly captured per ton CO2
    timeframe: 'Immediate',
    icon: '🏭',
    color: 'purple',
    benefits: ['Permanent removal', 'Technology advancement', 'Scalable'],
    action: 'Discover Tech'
  },
  ocean: {
    name: 'Ocean Restoration',
    description: 'Restore marine ecosystems that naturally capture carbon',
    pricePerTon: 0, // FREE
    efficiency: 15, // marine acres per ton CO2
    timeframe: '10-50 years',
    icon: '🌊',
    color: 'cyan',
    benefits: ['Marine biodiversity', 'Coastal protection', 'Fisheries recovery'],
    action: 'Dive In',
    organizations: ['Ocean Conservancy', 'Blue Carbon Initiative', 'Coral Restoration Foundation'],
    regions: ['Coral Reefs', 'Kelp Forests', 'Mangrove Swamps'],
    impact: {
      carbonStorage: '10x more than forests per acre',
      biodiversity: 'Supports 25% of marine species',
      protection: 'Natural coastal defense'
    }
  },
  soil: {
    name: 'Soil Carbon',
    description: 'Regenerative agriculture to store carbon in soil',
    pricePerTon: 0, // FREE
    efficiency: 5, // farm acres per ton CO2
    timeframe: '5-20 years',
    icon: '🌾',
    color: 'amber',
    benefits: ['Food security', 'Farmer income', 'Soil health'],
    action: 'Cultivate',
    organizations: ['Soil Health Institute', 'Carbon Farmers', 'Regenerative Agriculture Alliance'],
    regions: ['Midwest Farmland', 'California Vineyards', 'Global Croplands'],
    impact: {
      soilHealth: '1% increase = 25,000 gallons water storage',
      yields: '10-20% crop yield increase',
      resilience: 'Better drought and flood resistance'
    }
  },
  lifestyle: {
    name: 'Lifestyle Changes',
    description: 'Simple actions to reduce your carbon footprint',
    pricePerTon: 0, // FREE
    efficiency: 100, // daily actions per ton CO2
    timeframe: 'Immediate',
    icon: '🌱',
    color: 'emerald',
    benefits: ['Personal impact', 'Cost savings', 'Health benefits'],
    action: 'Take Action'
  }
}

// Calculate carbon offset awareness (FREE EDUCATIONAL VERSION)
export function calculateCarbonOffset(co2Tons, selectedProject = 'trees', showEducational = false) {
  const project = OFFSET_PROJECTS[selectedProject] || OFFSET_PROJECTS.trees

  // For educational modal, everything is FREE
  if (showEducational) {
    return {
      project: project,
      co2Tons: parseFloat(co2Tons.toFixed(3)),
      baseCost: 0, // FREE
      discount: 0,
      discountAmount: 0,
      finalCost: 0, // FREE
      impact: Math.ceil(co2Tons * project.efficiency),
      impactUnit: getImpactUnit(selectedProject),
      certificate: generateCertificateId(),
      educationalValue: getEducationalContent(selectedProject, co2Tons)
    }
  }

  // For flight details display, show informational costs (but still free to act on)
  const informationalCost = co2Tons * 25 // Standard $25/ton for reference
  const trees = Math.ceil(co2Tons * 40) // Standard 40 trees per ton

  return {
    cost: parseFloat(informationalCost.toFixed(2)),
    trees: trees,
    pricePerTon: 25,
    co2Tons: parseFloat(co2Tons.toFixed(3)),
    // For educational modal
    project: project,
    baseCost: 0,
    discount: 0,
    discountAmount: 0,
    finalCost: 0,
    impact: Math.ceil(co2Tons * project.efficiency),
    impactUnit: getImpactUnit(selectedProject),
    certificate: generateCertificateId(),
    educationalValue: getEducationalContent(selectedProject, co2Tons)
  }
}

// Get all available offset projects
export function getOffsetProjects() {
  return OFFSET_PROJECTS
}

// Get impact unit based on project type
function getImpactUnit(projectType) {
  switch (projectType) {
    case 'trees': return 'trees to learn about'
    case 'renewable': return 'MWh to explore'
    case 'carbonCapture': return 'tons to understand'
    case 'ocean': return 'marine acres to discover'
    case 'soil': return 'farm acres to explore'
    case 'lifestyle': return 'daily actions to try'
    default: return 'concepts to explore'
  }
}

// Get educational content for each project type
function getEducationalContent(projectType, co2Tons) {
  const impact = Math.ceil(co2Tons * (OFFSET_PROJECTS[projectType]?.efficiency || 1))

  switch (projectType) {
    case 'trees':
      return {
        title: 'Tree Planting Impact',
        facts: [
          `${impact} trees could absorb your ${co2Tons} tons of CO₂ over 20-30 years`,
          'One tree absorbs about 48 lbs of CO₂ per year',
          'Trees also provide oxygen, habitat, and prevent soil erosion'
        ],
        actions: [
          'Plant trees in your local community',
          'Support reforestation organizations',
          'Choose products from sustainable forestry'
        ]
      }
    case 'renewable':
      return {
        title: 'Clean Energy Solutions',
        facts: [
          `${impact} MWh of renewable energy could offset your emissions`,
          'Solar and wind power produce zero emissions during operation',
          'Renewable energy creates 3x more jobs than fossil fuels'
        ],
        actions: [
          'Switch to renewable energy provider',
          'Install solar panels if possible',
          'Support clean energy policies'
        ]
      }
    case 'carbonCapture':
      return {
        title: 'Carbon Capture Technology',
        facts: [
          `Direct air capture could remove ${impact} tons of CO₂ from atmosphere`,
          'Carbon capture can store CO₂ permanently underground',
          'Technology is rapidly advancing and costs are decreasing'
        ],
        actions: [
          'Learn about carbon capture companies',
          'Support climate technology research',
          'Advocate for carbon capture investments'
        ]
      }
    case 'ocean':
      return {
        title: 'Ocean Carbon Storage',
        facts: [
          `${impact} marine acres could store your ${co2Tons} tons of CO₂`,
          'Ocean ecosystems store 10x more carbon per acre than forests',
          'Healthy oceans support 25% of all marine species'
        ],
        actions: [
          'Support marine protected areas',
          'Reduce plastic consumption',
          'Choose sustainable seafood',
          'Participate in beach cleanups'
        ]
      }
    case 'soil':
      return {
        title: 'Soil Carbon Sequestration',
        facts: [
          `${impact} farm acres using regenerative practices could store your CO₂`,
          '1% increase in soil carbon stores 25,000 gallons of water per acre',
          'Healthy soil increases crop yields by 10-20%'
        ],
        actions: [
          'Support regenerative agriculture',
          'Buy from local organic farms',
          'Compost organic waste',
          'Learn about soil health'
        ]
      }
    case 'lifestyle':
      return {
        title: 'Lifestyle Changes',
        facts: [
          `${impact} small daily actions can significantly reduce emissions`,
          'Transportation accounts for 29% of US greenhouse gas emissions',
          'Simple changes can save money while helping the planet'
        ],
        actions: [
          'Use public transport or bike more often',
          'Reduce meat consumption',
          'Buy local and seasonal products',
          'Reduce energy consumption at home'
        ]
      }
    default:
      return {
        title: 'Climate Action',
        facts: ['Every action counts in fighting climate change'],
        actions: ['Learn more about environmental impact']
      }
  }
}

// Generate unique certificate ID
function generateCertificateId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `CERT-${timestamp}-${random}`.toUpperCase()
}

// Get emission category (low, medium, high)
export function getEmissionCategory(co2PerPassenger) {
  if (co2PerPassenger < 0.1) return { category: 'low', color: 'green' }
  if (co2PerPassenger < 0.3) return { category: 'medium', color: 'yellow' }
  return { category: 'high', color: 'red' }
}

// Format emissions for display
export function formatEmissions(emissions) {
  const { co2, co2PerPassenger } = emissions
  
  return {
    total: co2 >= 1 ? `${co2.toFixed(1)} tons` : `${(co2 * 1000).toFixed(0)} kg`,
    perPassenger: co2PerPassenger >= 1 ? 
      `${co2PerPassenger.toFixed(2)} tons` : 
      `${(co2PerPassenger * 1000).toFixed(0)} kg`,
    category: getEmissionCategory(co2PerPassenger)
  }
}

// Calculate global aviation emissions (estimated)
export function calculateGlobalEmissions(flights) {
  const totalCO2 = flights.reduce((sum, flight) => sum + (flight.emissions?.co2 || 0), 0)
  const averagePerFlight = totalCO2 / flights.length || 0
  
  // Estimate global daily emissions (very rough approximation)
  const estimatedDailyFlights = 100000 // Approximate global daily flights
  const estimatedDailyEmissions = averagePerFlight * estimatedDailyFlights
  
  return {
    currentSample: totalCO2,
    estimatedDaily: estimatedDailyEmissions,
    estimatedAnnual: estimatedDailyEmissions * 365,
    averagePerFlight: averagePerFlight,
    sampleSize: flights.length
  }
}
