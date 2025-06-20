import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, MapPin, Clock, Zap, TrendingUp } from 'lucide-react'
import { formatEmissions } from '../utils/emissionsCalculator'

const LiveFeed = ({ flights }) => {
  const getEmissionColor = (co2PerPassenger) => {
    if (co2PerPassenger < 0.1) return 'text-green-600 dark:text-green-400'
    if (co2PerPassenger < 0.3) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getEmissionBadgeColor = (co2PerPassenger) => {
    if (co2PerPassenger < 0.1) return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
    if (co2PerPassenger < 0.3) return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
    return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Live Flight Feed
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time emissions data
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      {/* Flight List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {flights.map((flight, index) => {
            const emissions = flight.emissions || {}
            const formattedEmissions = formatEmissions(emissions)
            
            return (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {/* Flight Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {flight.callsign || 'Unknown Flight'}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {flight.aircraft || 'Unknown Aircraft'}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEmissionBadgeColor(emissions.co2PerPassenger || 0)}`}>
                    {formattedEmissions.category.category.toUpperCase()}
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {flight.origin || 'Unknown'} → {flight.destination || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {flight.altitude ? `${Math.floor(flight.altitude / 1000)}k ft` : 'Unknown alt'}
                    </span>
                  </div>
                </div>

                {/* Emissions Data */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <div className={`text-sm font-bold ${getEmissionColor(emissions.co2PerPassenger || 0)}`}>
                      {formattedEmissions.total}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total CO₂</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-bold ${getEmissionColor(emissions.co2PerPassenger || 0)}`}>
                      {formattedEmissions.perPassenger}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Per Passenger</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {emissions.distance ? `${Math.floor(emissions.distance)} km` : 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Distance</div>
                  </div>
                </div>

                {/* Real-time Indicator */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {flight.velocity ? `${Math.floor(flight.velocity)} km/h` : 'Unknown speed'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Updated now
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Showing {flights.length} active flights</span>
          <span>Updates every 60s</span>
        </div>
      </div>
    </div>
  )
}

export default LiveFeed
