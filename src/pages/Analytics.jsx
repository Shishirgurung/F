import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Download,
  Filter,
  Globe,
  Plane,
  Activity,
  MapPin,
  Clock,
  Gauge,
  Navigation,
  Radio,
  Zap
} from 'lucide-react'
import { useFlightData } from '../contexts/FlightDataContext'

const Analytics = () => {
  const { flights, dataSource } = useFlightData()
  const [timeframe, setTimeframe] = useState('today')
  const [category, setCategory] = useState('overview')
  const [realTimeStats, setRealTimeStats] = useState({})

  // Calculate real-time flight statistics
  useEffect(() => {
    if (flights.length > 0) {
      const stats = calculateRealTimeStats(flights)
      setRealTimeStats(stats)
    }
  }, [flights])

  // Get the correct flight count for today
  const getCurrentFlightCount = () => {
    if (category === 'realtime') {
      // For real-time tab, always show live OpenSky count
      return realTimeStats.total || flights.length
    } else {
      // For other tabs, show filtered count
      return filteredFlights.length
    }
  }

  // Get display label for data source
  const getDataSourceLabel = () => {
    if (category === 'realtime') {
      return dataSource?.includes('OpenSky') ? 'Live OpenSky Data' : 'Real-time Data'
    } else {
      return 'Historical Data'
    }
  }

  // Calculate real-time flight statistics from OpenSky data
  const calculateRealTimeStats = (flightData) => {
    const now = Date.now()
    const recentFlights = flightData.filter(flight => {
      const lastUpdate = new Date(flight.lastUpdate || flight.timestamp).getTime()
      return (now - lastUpdate) < 300000 // Within last 5 minutes
    })

    // Flight status breakdown
    const takingOff = recentFlights.filter(f => f.altitude < 3000 && f.verticalRate > 5).length
    const inFlight = recentFlights.filter(f => f.altitude >= 3000 && f.altitude <= 12000).length
    const cruising = recentFlights.filter(f => f.altitude > 12000).length
    const landing = recentFlights.filter(f => f.altitude < 3000 && f.verticalRate < -5).length

    // Speed categories
    const lowSpeed = recentFlights.filter(f => f.velocity < 400).length
    const mediumSpeed = recentFlights.filter(f => f.velocity >= 400 && f.velocity < 800).length
    const highSpeed = recentFlights.filter(f => f.velocity >= 800).length

    // Regional breakdown
    const regions = {
      'North America': recentFlights.filter(f => f.latitude >= 25 && f.latitude <= 70 && f.longitude >= -170 && f.longitude <= -50).length,
      'Europe': recentFlights.filter(f => f.latitude >= 35 && f.latitude <= 70 && f.longitude >= -10 && f.longitude <= 40).length,
      'Asia Pacific': recentFlights.filter(f => f.latitude >= -50 && f.latitude <= 50 && f.longitude >= 60 && f.longitude <= 180).length,
      'Other': recentFlights.filter(f => {
        const lat = f.latitude, lng = f.longitude
        return !(
          (lat >= 25 && lat <= 70 && lng >= -170 && lng <= -50) ||
          (lat >= 35 && lat <= 70 && lng >= -10 && lng <= 40) ||
          (lat >= -50 && lat <= 50 && lng >= 60 && lng <= 180)
        )
      }).length
    }

    return {
      total: recentFlights.length,
      status: { takingOff, inFlight, cruising, landing },
      speed: { lowSpeed, mediumSpeed, highSpeed },
      regions,
      avgAltitude: recentFlights.reduce((sum, f) => sum + f.altitude, 0) / recentFlights.length || 0,
      avgSpeed: recentFlights.reduce((sum, f) => sum + f.velocity, 0) / recentFlights.length || 0,
      dataFreshness: Math.min(...recentFlights.map(f => now - new Date(f.lastUpdate || f.timestamp).getTime())) / 1000,
      isLiveData: dataSource?.includes('OpenSky') || false
    }
  }

  // Filter flights based on selected timeframe
  const getFilteredFlights = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const yearStart = new Date(now.getFullYear(), 0, 1)

    // Since we're using demo data, we'll simulate different timeframes
    // by filtering flights based on their IDs and creating realistic distributions
    switch (timeframe) {
      case 'today':
        // Show about 30% of flights for "today"
        return flights.filter((_, index) => index % 3 === 0)

      case 'week':
        // Show about 70% of flights for "this week"
        return flights.filter((_, index) => index % 3 !== 2)

      case 'month':
        // Show about 85% of flights for "this month"
        return flights.filter((_, index) => index % 6 !== 5)

      case 'year':
        // Show all flights for "this year"
        return flights

      default:
        return flights
    }
  }

  const filteredFlights = getFilteredFlights()

  // Export analytics data
  const handleExportAnalytics = () => {
    const analyticsData = {
      timeframe: timeframe,
      exportDate: new Date().toISOString(),
      flightCount: filteredFlights.length,
      totalEmissions: filteredFlights.reduce((sum, flight) => sum + (flight.emissions?.co2 || 0), 0),
      averageEmissions: filteredFlights.length > 0 ? filteredFlights.reduce((sum, flight) => sum + (flight.emissions?.co2 || 0), 0) / filteredFlights.length : 0,
      flights: filteredFlights.map(flight => ({
        callsign: flight.callsign,
        airline: flight.airline,
        aircraft: flight.aircraft,
        emissions: flight.emissions,
        origin: flight.origin,
        destination: flight.destination
      }))
    }

    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Detailed insights into aviation emissions patterns
              </p>
            </div>
            
            <button
              onClick={handleExportAnalytics}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Today</span>
            </button>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'realtime', label: 'Real-Time', icon: Activity },
                { id: 'emissions', label: 'Emissions', icon: TrendingUp },
                { id: 'airlines', label: 'Airlines', icon: Plane },
                { id: 'regions', label: 'Regions', icon: Globe }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategory(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      category === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </motion.div>



        {/* Content based on selected category */}
        <motion.div
          key={`${category}-${timeframe}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {category === 'overview' && <OverviewAnalytics flights={flights} timeframe={timeframe} />}
          {category === 'realtime' && <RealTimeAnalytics flights={flights} stats={realTimeStats} dataSource={dataSource} />}
          {category === 'emissions' && <EmissionsAnalytics flights={flights} timeframe={timeframe} />}
          {category === 'airlines' && <AirlinesAnalytics flights={flights} timeframe={timeframe} />}
          {category === 'regions' && <RegionsAnalytics flights={flights} timeframe={timeframe} />}
        </motion.div>
      </div>
    </div>
  )
}

// Overview Analytics Component
const OverviewAnalytics = ({ flights, timeframe }) => {
  const totalEmissions = flights.reduce((sum, flight) => sum + (flight.emissions?.co2 || 0), 0)
  const averageEmissions = totalEmissions / flights.length || 0

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'year': return 'This Year'
      default: return 'Current Period'
    }
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              📊 Analytics for {getTimeframeLabel()}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Showing data for {flights.length} flights in the selected timeframe
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {flights.length}
            </div>
            <div className="text-xs text-blue-500">flights tracked</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Metrics - {getTimeframeLabel()}
          </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total Flights</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {flights.length.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total CO₂</span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              {totalEmissions.toFixed(1)} tons
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Average per Flight</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {averageEmissions.toFixed(1)} tons
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Environmental Impact
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-sm text-red-600 dark:text-red-400 font-medium">
              Trees Needed for Offset
            </div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {Math.floor(totalEmissions * 40).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
              Carbon Offset Cost
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              ${(totalEmissions * 25).toFixed(0)}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

// Emissions Analytics Component
const EmissionsAnalytics = ({ flights, timeframe }) => {
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'year': return 'This Year'
      default: return 'Current Period'
    }
  }
  // Calculate emissions distribution
  const emissionsData = flights.map(flight => ({
    name: flight.callsign,
    co2: flight.emissions?.co2 || 0,
    co2PerPassenger: flight.emissions?.co2PerPassenger || 0,
    aircraft: flight.aircraft,
    distance: flight.emissions?.distance || 0
  }))

  const lowEmissions = emissionsData.filter(f => f.co2PerPassenger < 0.1).length
  const mediumEmissions = emissionsData.filter(f => f.co2PerPassenger >= 0.1 && f.co2PerPassenger < 0.3).length
  const highEmissions = emissionsData.filter(f => f.co2PerPassenger >= 0.3).length

  const distributionData = [
    { name: 'Low (<0.1t)', value: lowEmissions, color: '#22c55e' },
    { name: 'Medium (0.1-0.3t)', value: mediumEmissions, color: '#f59e0b' },
    { name: 'High (>0.3t)', value: highEmissions, color: '#ef4444' }
  ]

  const totalEmissions = emissionsData.reduce((sum, f) => sum + f.co2, 0)
  const averageEmissions = totalEmissions / emissionsData.length

  return (
    <div className="space-y-8">
      {/* Timeframe Header */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
          🔥 Emissions Analysis - {getTimeframeLabel()}
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300">
          Detailed breakdown of {flights.length} flights' carbon emissions
        </p>
      </div>

      {/* Distribution Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Emissions Distribution
          </h3>
          <div className="space-y-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((item.value / flights.length) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Emissions Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Emissions</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {totalEmissions.toFixed(1)} tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average per Flight</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {averageEmissions.toFixed(1)} tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Most Efficient</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {Math.min(...emissionsData.map(f => f.co2PerPassenger)).toFixed(3)} t/pax
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Least Efficient</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {Math.max(...emissionsData.map(f => f.co2PerPassenger)).toFixed(3)} t/pax
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Aircraft Type Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aircraft Type Efficiency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['B737', 'A320', 'B777', 'A350', 'B787', 'A380'].map(aircraft => {
            const aircraftFlights = emissionsData.filter(f => f.aircraft === aircraft)
            const avgEmissions = aircraftFlights.length > 0
              ? aircraftFlights.reduce((sum, f) => sum + f.co2PerPassenger, 0) / aircraftFlights.length
              : 0

            return (
              <div key={aircraft} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {aircraft}
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {avgEmissions.toFixed(3)} t/pax
                </div>
                <div className="text-xs text-gray-500">
                  {aircraftFlights.length} flights
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Airlines Analytics Component
const AirlinesAnalytics = ({ flights, timeframe }) => {
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'year': return 'This Year'
      default: return 'Current Period'
    }
  }
  // Group flights by airline
  const airlineData = flights.reduce((acc, flight) => {
    const airline = flight.airline || 'Unknown'
    if (!acc[airline]) {
      acc[airline] = {
        name: airline,
        flights: 0,
        totalEmissions: 0,
        totalPassengers: 0,
        totalDistance: 0
      }
    }
    acc[airline].flights++
    acc[airline].totalEmissions += flight.emissions?.co2 || 0
    acc[airline].totalPassengers += flight.passengers || 150
    acc[airline].totalDistance += flight.emissions?.distance || 0
    return acc
  }, {})

  const airlines = Object.values(airlineData)
    .map(airline => ({
      ...airline,
      avgEmissionsPerFlight: airline.totalEmissions / airline.flights,
      avgEmissionsPerPassenger: airline.totalEmissions / airline.totalPassengers,
      efficiency: (airline.totalDistance / airline.totalEmissions) || 0
    }))
    .sort((a, b) => b.totalEmissions - a.totalEmissions)

  const topPerformers = airlines.slice(0, 5)
  const worstPerformers = airlines.slice(-5).reverse()

  return (
    <div className="space-y-8">
      {/* Timeframe Header */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
          ✈️ Airline Performance - {getTimeframeLabel()}
        </h3>
        <p className="text-sm text-purple-700 dark:text-purple-300">
          Comparing {Object.keys(flights.reduce((acc, f) => ({ ...acc, [f.airline || 'Unknown']: true }), {})).length} airlines across {flights.length} flights
        </p>
      </div>

      {/* Airline Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏆 Most Efficient Airlines
          </h3>
          <div className="space-y-3">
            {airlines
              .sort((a, b) => a.avgEmissionsPerPassenger - b.avgEmissionsPerPassenger)
              .slice(0, 5)
              .map((airline, index) => (
                <div key={airline.name} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{airline.name}</div>
                      <div className="text-sm text-gray-500">{airline.flights} flights</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {airline.avgEmissionsPerPassenger.toFixed(3)} t/pax
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Highest Emitters
          </h3>
          <div className="space-y-3">
            {topPerformers.map((airline, index) => (
              <div key={airline.name} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{airline.name}</div>
                    <div className="text-sm text-gray-500">{airline.flights} flights</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {airline.totalEmissions.toFixed(1)} tons
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detailed Airline Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Airline</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Flights</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Total CO₂</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Avg/Flight</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Avg/Passenger</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {airlines.slice(0, 10).map((airline, index) => (
                <tr key={airline.name} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{airline.name}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{airline.flights}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{airline.totalEmissions.toFixed(1)}t</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{airline.avgEmissionsPerFlight.toFixed(1)}t</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{airline.avgEmissionsPerPassenger.toFixed(3)}t</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      airline.efficiency > 2
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : airline.efficiency > 1.5
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {airline.efficiency.toFixed(1)} km/t
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Regions Analytics Component
const RegionsAnalytics = ({ flights, timeframe }) => {
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'year': return 'This Year'
      default: return 'Current Period'
    }
  }
  // Define regions and their coordinates
  const regions = {
    'North America': { flights: 0, emissions: 0, color: '#3b82f6' },
    'Europe': { flights: 0, emissions: 0, color: '#10b981' },
    'Asia Pacific': { flights: 0, emissions: 0, color: '#f59e0b' },
    'Middle East': { flights: 0, emissions: 0, color: '#8b5cf6' },
    'Africa': { flights: 0, emissions: 0, color: '#ef4444' },
    'South America': { flights: 0, emissions: 0, color: '#06b6d4' }
  }

  // Categorize flights by region based on coordinates
  flights.forEach(flight => {
    const lat = flight.latitude
    const lng = flight.longitude

    let region = 'Unknown'
    if (lat >= 25 && lat <= 70 && lng >= -170 && lng <= -50) {
      region = 'North America'
    } else if (lat >= 35 && lat <= 70 && lng >= -10 && lng <= 40) {
      region = 'Europe'
    } else if (lat >= -50 && lat <= 50 && lng >= 60 && lng <= 180) {
      region = 'Asia Pacific'
    } else if (lat >= 10 && lat <= 40 && lng >= 25 && lng <= 60) {
      region = 'Middle East'
    } else if (lat >= -35 && lat <= 35 && lng >= -20 && lng <= 50) {
      region = 'Africa'
    } else if (lat >= -60 && lat <= 15 && lng >= -85 && lng <= -35) {
      region = 'South America'
    }

    if (regions[region]) {
      regions[region].flights++
      regions[region].emissions += flight.emissions?.co2 || 0
    }
  })

  const regionData = Object.entries(regions)
    .map(([name, data]) => ({
      name,
      ...data,
      avgEmissions: data.flights > 0 ? data.emissions / data.flights : 0,
      percentage: (data.flights / flights.length) * 100
    }))
    .sort((a, b) => b.emissions - a.emissions)

  const totalEmissions = regionData.reduce((sum, r) => sum + r.emissions, 0)

  return (
    <div className="space-y-8">
      {/* Timeframe Header */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
          🌍 Regional Analysis - {getTimeframeLabel()}
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Geographic distribution of {flights.length} flights across global regions
        </p>
      </div>

      {/* Regional Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🌍 Regional Distribution
          </h3>
          <div className="space-y-4">
            {regionData.map((region, index) => (
              <div key={region.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {region.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {region.flights}
                  </div>
                  <div className="text-xs text-gray-500">
                    {region.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Emissions by Region
          </h3>
          <div className="space-y-4">
            {regionData.map((region, index) => (
              <div key={region.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {region.name}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {region.emissions.toFixed(1)} tons
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: region.color,
                      width: `${(region.emissions / totalEmissions) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Regional Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionData.map((region) => (
            <div key={region.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                <h4 className="font-medium text-gray-900 dark:text-white">{region.name}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Flights</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{region.flights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total CO₂</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{region.emissions.toFixed(1)}t</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg/Flight</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{region.avgEmissions.toFixed(1)}t</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Share</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{region.percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Regional Efficiency Ranking
        </h3>
        <div className="space-y-3">
          {regionData
            .sort((a, b) => a.avgEmissions - b.avgEmissions)
            .map((region, index) => (
              <div key={region.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{region.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {region.avgEmissions.toFixed(1)} t/flight
                  </div>
                  <div className="text-xs text-gray-500">
                    {region.flights} flights
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

// Real-Time Analytics Component
const RealTimeAnalytics = ({ flights, stats, dataSource }) => {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'takingOff': return 'bg-yellow-500'
      case 'inFlight': return 'bg-blue-500'
      case 'cruising': return 'bg-green-500'
      case 'landing': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getSpeedCategory = (speed) => {
    if (speed < 400) return { label: 'Low Speed', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (speed < 800) return { label: 'Medium Speed', color: 'text-blue-600', bg: 'bg-blue-100' }
    return { label: 'High Speed', color: 'text-green-600', bg: 'bg-green-100' }
  }

  return (
    <div className="space-y-8">
      {/* Real-Time Header */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">
              🔴 Live Flight Data - OpenSky Network
            </h3>
            <p className="text-sm text-cyan-700 dark:text-cyan-300">
              Real-time aviation data from {stats.total || 0} active flights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-cyan-600 dark:text-cyan-400">Last Update</div>
              <div className="text-sm font-mono text-cyan-800 dark:text-cyan-200">
                {formatTime(lastUpdate)}
              </div>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}
            >
              {autoRefresh ? '🟢 Auto-Refresh' : '⏸️ Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Source Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              📡 Data Source Status
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stats.isLiveData ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {dataSource || 'Unknown Source'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {stats.total || 0}
            </div>
            <div className="text-xs text-gray-500">Active Flights</div>
          </div>
        </div>
      </div>

      {/* Flight Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🛫 Flight Status Breakdown
          </h3>
          <div className="space-y-4">
            {[
              { key: 'takingOff', label: 'Taking Off', icon: '🛫' },
              { key: 'inFlight', label: 'In Flight', icon: '✈️' },
              { key: 'cruising', label: 'Cruising', icon: '🌤️' },
              { key: 'landing', label: 'Landing', icon: '🛬' }
            ].map(status => (
              <div key={status.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{status.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {status.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.status?.[status.key] || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats.total > 0 ? ((stats.status?.[status.key] || 0) / stats.total * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚡ Speed Distribution
          </h3>
          <div className="space-y-4">
            {[
              { key: 'lowSpeed', label: 'Low Speed (<400 km/h)', color: 'yellow' },
              { key: 'mediumSpeed', label: 'Medium Speed (400-800 km/h)', color: 'blue' },
              { key: 'highSpeed', label: 'High Speed (>800 km/h)', color: 'green' }
            ].map(speed => (
              <div key={speed.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-${speed.color}-500`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {speed.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.speed?.[speed.key] || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats.total > 0 ? ((stats.speed?.[speed.key] || 0) / stats.total * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🌍 Live Regional Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.regions || {}).map(([region, count]) => (
            <div key={region} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {region}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <Gauge className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Altitude</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(stats.avgAltitude || 0).toLocaleString()} ft
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <Navigation className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Speed</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(stats.avgSpeed || 0)} km/h
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Data Freshness</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(stats.dataFreshness || 0)}s
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
