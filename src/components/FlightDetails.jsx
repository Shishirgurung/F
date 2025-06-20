import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Plane,
  MapPin,
  Clock,
  Gauge,
  Zap,
  Leaf,
  DollarSign,
  TrendingUp,
  Users,
  Fuel,
  Target,
  StopCircle,
  Info
} from 'lucide-react'
import { formatEmissions, calculateCarbonOffset } from '../utils/emissionsCalculator'
import { useFlightData } from '../contexts/FlightDataContext'
import CarbonOffsetModal from './CarbonOffsetModal'

const FlightDetails = ({ flight, onClose }) => {
  if (!flight) return null

  const { trackFlight, untrackFlight, isFlightTracked, trackedFlights } = useFlightData()
  const [showOffsetModal, setShowOffsetModal] = useState(false)

  const isTracked = isFlightTracked(flight.id)
  const trackedFlightData = trackedFlights.find(tracked => tracked.id === flight.id)

  const emissions = flight.emissions || {}
  const formattedEmissions = formatEmissions(emissions)
  const carbonOffset = calculateCarbonOffset(emissions.co2 || 0, 'trees', false) // false for informational display

  const handleTrackFlight = () => {
    if (isTracked) {
      untrackFlight(flight.id)
    } else {
      trackFlight(flight)
    }
  }

  const handleOffsetEmissions = () => {
    setShowOffsetModal(true)
  }

  const details = [
    {
      icon: Plane,
      label: 'Aircraft',
      value: flight.aircraft || 'Unknown',
      color: 'blue'
    },
    {
      icon: MapPin,
      label: 'Route',
      value: `${flight.origin || 'Unknown'} → ${flight.destination || 'Unknown'}`,
      color: 'green'
    },
    {
      icon: Gauge,
      label: 'Altitude',
      value: flight.altitude ? `${Math.floor(flight.altitude / 1000)}k ft` : 'Unknown',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      label: 'Speed',
      value: flight.velocity ? `${Math.floor(flight.velocity)} km/h` : 'Unknown',
      color: 'orange'
    }
  ]

  const emissionDetails = [
    {
      icon: Zap,
      label: 'Total CO₂',
      value: formattedEmissions.total,
      color: 'red'
    },
    {
      icon: Users,
      label: 'Per Passenger',
      value: formattedEmissions.perPassenger,
      color: 'yellow'
    },
    {
      icon: MapPin,
      label: 'Distance',
      value: emissions.distance ? `${Math.floor(emissions.distance)} km` : 'Unknown',
      color: 'blue'
    },
    {
      icon: Fuel,
      label: 'Fuel Used',
      value: emissions.fuelConsumption ? `${emissions.fuelConsumption.toFixed(1)} tons` : 'Unknown',
      color: 'gray'
    }
  ]

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="h-full bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {flight.callsign || 'Unknown Flight'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {flight.airline || 'Unknown Airline'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Flight Status */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            Live Tracking
          </span>
          <span className="text-xs text-green-600 dark:text-green-400">
            Updated now
          </span>
        </div>
      </div>

      {/* Tracking Status */}
      {isTracked && trackedFlightData && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Flight Tracked
              </span>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {Math.floor(trackedFlightData.accumulatedEmissions.trackingDuration)} min
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-blue-600 dark:text-blue-400">Accumulated CO₂</div>
              <div className="font-medium text-blue-800 dark:text-blue-200">
                {trackedFlightData.accumulatedEmissions.co2.toFixed(3)} tons
              </div>
            </div>
            <div>
              <div className="text-blue-600 dark:text-blue-400">Positions Logged</div>
              <div className="font-medium text-blue-800 dark:text-blue-200">
                {trackedFlightData.positionHistory.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Details */}
      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Flight Information
          </h4>
          <div className="space-y-3">
            {details.map((detail, index) => {
              const Icon = detail.icon
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`p-2 bg-${detail.color}-100 dark:bg-${detail.color}-900/20 rounded-lg`}>
                    <Icon className={`h-4 w-4 text-${detail.color}-600 dark:text-${detail.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {detail.label}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {detail.value}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Emissions Analysis */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Emissions Analysis
          </h4>
          
          {/* Emission Level Badge */}
          <div className="mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              formattedEmissions.category.category === 'low' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : formattedEmissions.category.category === 'medium'
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {formattedEmissions.category.category.toUpperCase()} EMISSIONS
            </div>
          </div>

          <div className="space-y-3">
            {emissionDetails.map((detail, index) => {
              const Icon = detail.icon
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`p-2 bg-${detail.color}-100 dark:bg-${detail.color}-900/20 rounded-lg`}>
                    <Icon className={`h-4 w-4 text-${detail.color}-600 dark:text-${detail.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {detail.label}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {detail.value}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Enhanced Environmental Impact */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Environmental Impact & Offset Options</span>
          </h4>

          <div className="space-y-3">
            {/* Trees Equivalent */}
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Tree Planting Equivalent
                  </span>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  Most Popular
                </span>
              </div>
              <div className="text-lg font-bold text-green-800 dark:text-green-200">
                🌳 {carbonOffset.trees} trees
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Would absorb this CO₂ over 20-30 years • Supports biodiversity
              </div>
            </div>

            {/* Market Value */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Carbon Market Value
                  </span>
                </div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  Reference
                </span>
              </div>
              <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                💰 ${carbonOffset.cost}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Market rate: ${carbonOffset.pricePerTon}/ton CO₂ • Educational reference only
              </div>
            </div>

            {/* Multiple Offset Options Preview */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                  <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Multiple Offset Options Available
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <span>🌊</span>
                  <span className="text-purple-600 dark:text-purple-400">Ocean restoration</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🌾</span>
                  <span className="text-purple-600 dark:text-purple-400">Soil carbon</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>⚡</span>
                  <span className="text-purple-600 dark:text-purple-400">Clean energy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🏭</span>
                  <span className="text-purple-600 dark:text-purple-400">Carbon capture</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center space-x-2 mb-1">
                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                  <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Free Climate Education
                </span>
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                🎓 Learn about all offset options and take meaningful climate action!
                <br />
                <span className="font-medium">100% free educational experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Comparison
          </h4>
          
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>vs. Average flight:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 30).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>vs. Train (same route):</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                +{(Math.random() * 500 + 200).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>vs. Car (same route):</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">
                +{(Math.random() * 100 + 50).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <button
              onClick={handleTrackFlight}
              className={`w-full p-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 ${
                isTracked
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isTracked ? (
                <>
                  <StopCircle className="h-4 w-4" />
                  <span>Stop Tracking</span>
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  <span>Track This Flight</span>
                </>
              )}
            </button>
            <button
              onClick={handleOffsetEmissions}
              className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Leaf className="h-4 w-4" />
              <span>🌱 Explore Offset Options</span>
            </button>
            <button className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
              Share Flight
            </button>
          </div>
        </div>
      </div>

      {/* Carbon Offset Modal */}
      <CarbonOffsetModal
        isOpen={showOffsetModal}
        onClose={() => setShowOffsetModal(false)}
        flight={flight}
        emissions={emissions}
      />
    </motion.div>
  )
}

export default FlightDetails
