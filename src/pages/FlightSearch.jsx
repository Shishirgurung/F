import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plane, MapPin, Clock, Zap, Filter } from 'lucide-react'
import { useFlightData } from '../contexts/FlightDataContext'
import { formatEmissions } from '../utils/emissionsCalculator'

const FlightSearch = () => {
  const { flights } = useFlightData()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (query) => {
    setSearchQuery(query)
    setIsSearching(true)
    
    // Simulate search delay
    setTimeout(() => {
      if (query.trim()) {
        const results = flights.filter(flight => 
          flight.callsign?.toLowerCase().includes(query.toLowerCase()) ||
          flight.airline?.toLowerCase().includes(query.toLowerCase()) ||
          flight.aircraft?.toLowerCase().includes(query.toLowerCase()) ||
          flight.origin?.toLowerCase().includes(query.toLowerCase()) ||
          flight.destination?.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
      setIsSearching(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Flight Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for specific flights and view their emission profiles
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by flight number, airline, aircraft, or route..."
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Search Results ({searchResults.length})
                  </h2>
                </div>
                
                <div className="grid gap-4">
                  {searchResults.map((flight) => (
                    <FlightCard 
                      key={flight.id} 
                      flight={flight} 
                      onClick={() => setSelectedFlight(flight)}
                      isSelected={selectedFlight?.id === flight.id}
                    />
                  ))}
                </div>
              </div>
            ) : !isSearching ? (
              <div className="text-center py-12">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No flights found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try searching with a different term
                </p>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Popular Searches
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['American Airlines', 'Boeing 777', 'New York', 'Emirates'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {term}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Flights
              </h2>
              <div className="grid gap-4">
                {flights.slice(0, 5).map((flight) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight} 
                    onClick={() => setSelectedFlight(flight)}
                    isSelected={selectedFlight?.id === flight.id}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Flight Details Modal */}
        {selectedFlight && (
          <FlightDetailsModal 
            flight={selectedFlight} 
            onClose={() => setSelectedFlight(null)} 
          />
        )}
      </div>
    </div>
  )
}

// Flight Card Component
const FlightCard = ({ flight, onClick, isSelected }) => {
  const emissions = flight.emissions || {}
  const formattedEmissions = formatEmissions(emissions)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {flight.callsign || 'Unknown Flight'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {flight.airline || 'Unknown Airline'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formattedEmissions.total}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total CO₂
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">
            {flight.origin || 'Unknown'} → {flight.destination || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Plane className="h-3 w-3 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">
            {flight.aircraft || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="h-3 w-3 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">
            {formattedEmissions.perPassenger}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Flight Details Modal Component
const FlightDetailsModal = ({ flight, onClose }) => {
  const emissions = flight.emissions || {}
  const formattedEmissions = formatEmissions(emissions)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Flight Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {flight.callsign || 'Unknown Flight'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {flight.airline || 'Unknown Airline'} • {flight.aircraft || 'Unknown Aircraft'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Route</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {flight.origin || 'Unknown'} → {flight.destination || 'Unknown'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Altitude</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {flight.altitude ? `${Math.floor(flight.altitude / 1000)}k ft` : 'Unknown'}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Emissions Profile
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total CO₂</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formattedEmissions.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Per Passenger</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formattedEmissions.perPassenger}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {emissions.distance ? `${Math.floor(emissions.distance)} km` : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FlightSearch
