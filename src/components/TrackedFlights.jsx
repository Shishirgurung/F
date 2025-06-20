import React from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Target, 
  Plane, 
  MapPin, 
  Clock, 
  Zap, 
  TrendingUp,
  StopCircle,
  Eye
} from 'lucide-react'
import { useFlightData } from '../contexts/FlightDataContext'
import { formatEmissions } from '../utils/emissionsCalculator'

const TrackedFlights = ({ onClose, onFlightSelect }) => {
  const { trackedFlights, untrackFlight } = useFlightData()

  const formatTrackingDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const formatLastUpdate = (timestamp) => {
    const now = new Date()
    const lastUpdate = new Date(timestamp)
    const diffMinutes = Math.floor((now - lastUpdate) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}h ago`
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="h-full bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tracked Flights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {trackedFlights.length} flight{trackedFlights.length !== 1 ? 's' : ''} being monitored
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

      {/* Tracked Flights List */}
      <div className="p-4">
        {trackedFlights.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Tracked Flights
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click "Track This Flight" on any flight to start monitoring its emissions and path.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trackedFlights.map((flight) => {
              const formattedEmissions = formatEmissions(flight.emissions || {})
              
              return (
                <motion.div
                  key={flight.trackingId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  {/* Flight Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {flight.callsign || 'Unknown Flight'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {flight.airline || 'Unknown Airline'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onFlightSelect && onFlightSelect(flight)}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => untrackFlight(flight.id)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Stop tracking"
                      >
                        <StopCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Flight Info */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {flight.origin || 'Unknown'} → {flight.destination || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {flight.altitude ? `${Math.floor(flight.altitude / 1000)}k ft` : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white dark:bg-gray-800 rounded p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Tracking</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatTrackingDuration(flight.accumulatedEmissions?.trackingDuration || 0)}
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <Zap className="h-3 w-3 text-red-600 dark:text-red-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Accumulated CO₂</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {(flight.accumulatedEmissions?.co2 || 0).toFixed(3)} tons
                      </div>
                    </div>
                  </div>

                  {/* Current Emissions */}
                  <div className="bg-white dark:bg-gray-800 rounded p-2 mb-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Emissions</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formattedEmissions.total}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        formattedEmissions.category.category === 'low' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : formattedEmissions.category.category === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      }`}>
                        {formattedEmissions.category.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Last Update */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Last update: {formatLastUpdate(flight.lastUpdate || flight.trackingStartTime)}</span>
                    <span>{flight.positionHistory?.length || 0} positions logged</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TrackedFlights
