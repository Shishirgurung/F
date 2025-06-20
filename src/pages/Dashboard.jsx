import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plane,
  TrendingUp,
  Globe,
  Zap,
  AlertTriangle,
  Activity,
  BarChart3,
  Users,
  Award,
  Download
} from 'lucide-react'
import { useFlightData } from '../contexts/FlightDataContext'
import { calculateGlobalEmissions, formatEmissions } from '../utils/emissionsCalculator'
import StatsCard from '../components/StatsCard'
import EmissionsChart from '../components/EmissionsChart'
import TopEmitters from '../components/TopEmitters'
import LiveFeed from '../components/LiveFeed'
import OffsetHistory from '../components/OffsetHistory'
import DemoAdContainer from '../components/AdDemo/DemoAdContainer'
import DataSourceIndicator from '../components/DataSourceIndicator'

const Dashboard = () => {
  const {
    flights,
    totalEmissions
  } = useFlightData()
  const [showOffsetHistory, setShowOffsetHistory] = useState(false)
  const navigate = useNavigate()

  // Export data functionality
  const handleExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalFlights: flights.length,
      totalEmissions: totalEmissions,
      flights: flights.map(flight => ({
        callsign: flight.callsign,
        airline: flight.airline,
        aircraft: flight.aircraft,
        origin: flight.origin,
        destination: flight.destination,
        emissions: flight.emissions
      })),
      globalStats: calculateGlobalEmissions(flights)
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `carbon-emissions-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Calculate real-time statistics
  const globalStats = calculateGlobalEmissions(flights)
  const activeFlights = flights.length
  const totalCO2Today = flights.reduce((sum, flight) => sum + (flight.emissions?.co2 || 0), 0)
  const averageEmissionsPerFlight = totalCO2Today / activeFlights || 0

  const stats = [
    {
      title: 'Active Flights',
      value: activeFlights.toLocaleString(),
      change: '+2.3%',
      changeType: 'increase',
      icon: Plane,
      color: 'blue'
    },
    {
      title: 'CO₂ Today (Sample)',
      value: `${totalCO2Today.toFixed(1)} tons`,
      change: '+5.7%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'red'
    },
    {
      title: 'Estimated Daily Global',
      value: `${(globalStats.estimatedDaily / 1000).toFixed(0)}K tons`,
      change: '+1.2%',
      changeType: 'increase',
      icon: Globe,
      color: 'orange'
    },
    {
      title: 'Avg per Flight',
      value: `${averageEmissionsPerFlight.toFixed(1)} tons`,
      change: '-0.8%',
      changeType: 'decrease',
      icon: Activity,
      color: 'green'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Aviation Emissions Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Real-time monitoring of global aviation carbon emissions
              </p>
            </div>
            
            {/* Clear Data Source Status */}
            <DataSourceIndicator className="w-80" />
          </div>
        </motion.div>

        {/* Top Banner Ad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6"
        >
          <DemoAdContainer placement="banner" />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-3 space-y-8">
            {/* Emissions Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <EmissionsChart />
            </motion.div>

            {/* Top Emitters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TopEmitters flights={flights} />
            </motion.div>
          </div>

          {/* Middle Column - Live Feed */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LiveFeed flights={flights.slice(0, 10)} />
            </motion.div>
          </div>

          {/* Right Column - Ads */}
          <div className="space-y-8">
            {/* Sidebar Ad */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="sticky top-4"
            >
              <DemoAdContainer placement="sidebar" showLabel={false} />
            </motion.div>

            {/* Video Ad */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="sticky top-96"
            >
              <DemoAdContainer placement="video" showLabel={false} />
            </motion.div>
          </div>
        </div>

        {/* Environmental Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Environmental Impact
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
                Daily CO₂ Equivalent
              </div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {(globalStats.estimatedDaily * 1000).toLocaleString()} kg
              </div>
              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                ≈ {Math.floor(globalStats.estimatedDaily * 40).toLocaleString()} trees needed to offset
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                Sample Efficiency
              </div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {(averageEmissionsPerFlight * 1000).toFixed(0)} kg CO₂/flight
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                Based on {activeFlights} active flights
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">
                Carbon Offset Cost
              </div>
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                ${(totalCO2Today * 25).toFixed(0)}
              </div>
              <div className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
                To offset today's sample emissions
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">View Analytics</span>
            </button>
            <button
              onClick={() => navigate('/map')}
              className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 font-medium">Live Map</span>
            </button>
            <button
              onClick={() => setShowOffsetHistory(true)}
              className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-700 dark:text-orange-300 font-medium">Learning History</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300 font-medium">Export Data</span>
            </button>
          </div>
        </motion.div>

        {/* Offset History Modal */}
        {showOffsetHistory && (
          <OffsetHistory onClose={() => setShowOffsetHistory(false)} />
        )}
      </div>
    </div>
  )
}

export default Dashboard
