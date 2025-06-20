import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Filter, Plane, Building2, MapPin, Sliders } from 'lucide-react'

const FlightFilters = ({ filters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      airline: '',
      aircraft: '',
      country: '',
      minDistance: 0,
      maxDistance: 20000
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const airlines = [
    'American Airlines', 'Delta Air Lines', 'United Airlines', 'British Airways',
    'Lufthansa', 'Air France', 'KLM', 'Emirates', 'Qatar Airways', 'Singapore Airlines'
  ]

  const aircraftTypes = [
    'B737', 'A320', 'B777', 'A350', 'B787', 'A380', 'B747', 'A330', 'B767', 'A319'
  ]

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Netherlands',
    'United Arab Emirates', 'Qatar', 'Singapore', 'Japan', 'China'
  ]

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
              <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Flight Filters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-6">
        {/* Airline Filter */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Building2 className="h-4 w-4" />
            <span>Airline</span>
          </label>
          <select
            value={localFilters.airline}
            onChange={(e) => handleFilterChange('airline', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Airlines</option>
            {airlines.map((airline) => (
              <option key={airline} value={airline}>
                {airline}
              </option>
            ))}
          </select>
        </div>

        {/* Aircraft Filter */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Plane className="h-4 w-4" />
            <span>Aircraft Type</span>
          </label>
          <select
            value={localFilters.aircraft}
            onChange={(e) => handleFilterChange('aircraft', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Aircraft</option>
            {aircraftTypes.map((aircraft) => (
              <option key={aircraft} value={aircraft}>
                {aircraft}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <MapPin className="h-4 w-4" />
            <span>Country</span>
          </label>
          <select
            value={localFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Range */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Sliders className="h-4 w-4" />
            <span>Flight Distance (km)</span>
          </label>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Minimum: {localFilters.minDistance} km
              </label>
              <input
                type="range"
                min="0"
                max="20000"
                step="100"
                value={localFilters.minDistance}
                onChange={(e) => handleFilterChange('minDistance', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Maximum: {localFilters.maxDistance} km
              </label>
              <input
                type="range"
                min="0"
                max="20000"
                step="100"
                value={localFilters.maxDistance}
                onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Emissions Level Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Emissions Level
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Levels', color: 'gray' },
              { value: 'low', label: 'Low (<0.1t per passenger)', color: 'green' },
              { value: 'medium', label: 'Medium (0.1-0.3t)', color: 'yellow' },
              { value: 'high', label: 'High (>0.3t)', color: 'red' }
            ].map((level) => (
              <label key={level.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="emissionLevel"
                  value={level.value}
                  checked={localFilters.emissionLevel === level.value}
                  onChange={(e) => handleFilterChange('emissionLevel', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className={`w-3 h-3 rounded-full bg-${level.color}-500`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {level.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Quick Filters
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFilterChange('aircraft', 'A380')}
              className="p-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              A380 Only
            </button>
            <button
              onClick={() => handleFilterChange('emissionLevel', 'high')}
              className="p-2 text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              High Emissions
            </button>
            <button
              onClick={() => handleFilterChange('minDistance', 5000)}
              className="p-2 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              Long Haul
            </button>
            <button
              onClick={() => handleFilterChange('maxDistance', 1000)}
              className="p-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              Short Haul
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={clearAllFilters}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Active filters: {Object.values(localFilters).filter(v => v && v !== 0 && v !== 20000).length}
        </div>
      </div>
    </motion.div>
  )
}

export default FlightFilters
