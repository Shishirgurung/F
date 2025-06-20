import React from 'react'
import { motion } from 'framer-motion'

// Simple, reliable map component that always works
const SimpleMapComponent = ({
  flights = [],
  selectedFlight,
  onFlightSelect,
  mapStyle = 'dark',
  showHeatmap = false,
  isFullscreen = false
}) => {

  // Debug logging
  console.log('🗺️ SimpleMapComponent rendering:', {
    flightCount: flights.length,
    mapStyle,
    selectedFlight: selectedFlight?.callsign
  })
  
  // Get background style based on map style
  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'bg-gradient-to-br from-blue-900 via-green-800 to-blue-900'
      case 'streets':
        return 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
      case 'light':
        return 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
      case 'dark':
      default:
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800'
    }
  }

  const isDark = mapStyle === 'dark' || mapStyle === 'satellite'
  const textColor = isDark ? 'text-white' : 'text-gray-900'
  const gridColor = isDark ? 'border-white/20' : 'border-gray-400/30'

  return (
    <div className={`relative w-full h-full ${getMapBackground()} overflow-hidden`} style={{ minHeight: '500px' }}>
      {/* Test visibility */}
      <div className="absolute top-0 right-0 bg-yellow-400 text-black p-2 z-50 text-xs">
        MAP LOADED ✅ {flights.length} flights
      </div>
      {/* World Map Grid */}
      <div className="absolute inset-0">
        {/* Latitude lines */}
        {[...Array(18)].map((_, i) => (
          <div 
            key={`lat-${i}`}
            className={`absolute w-full border-t ${gridColor}`}
            style={{ top: `${(i + 1) * 5}%` }}
          />
        ))}
        {/* Longitude lines */}
        {[...Array(36)].map((_, i) => (
          <div 
            key={`lng-${i}`}
            className={`absolute h-full border-l ${gridColor}`}
            style={{ left: `${(i + 1) * 2.5}%` }}
          />
        ))}
      </div>

      {/* Continents Outline (Simplified) */}
      <div className="absolute inset-0 opacity-40">
        {/* North America */}
        <div 
          className={`absolute ${isDark ? 'bg-green-600/30' : 'bg-green-400/50'} rounded-lg`}
          style={{ 
            left: '15%', 
            top: '20%', 
            width: '20%', 
            height: '25%',
            clipPath: 'polygon(0% 20%, 80% 0%, 100% 60%, 60% 100%, 0% 80%)'
          }}
        />
        
        {/* Europe */}
        <div 
          className={`absolute ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/50'} rounded-lg`}
          style={{ 
            left: '45%', 
            top: '15%', 
            width: '15%', 
            height: '20%',
            clipPath: 'polygon(0% 0%, 100% 20%, 80% 100%, 20% 80%)'
          }}
        />
        
        {/* Asia */}
        <div 
          className={`absolute ${isDark ? 'bg-yellow-600/30' : 'bg-yellow-400/50'} rounded-lg`}
          style={{ 
            left: '60%', 
            top: '10%', 
            width: '25%', 
            height: '35%',
            clipPath: 'polygon(0% 30%, 70% 0%, 100% 40%, 80% 100%, 0% 80%)'
          }}
        />
        
        {/* Africa */}
        <div 
          className={`absolute ${isDark ? 'bg-orange-600/30' : 'bg-orange-400/50'} rounded-lg`}
          style={{ 
            left: '45%', 
            top: '35%', 
            width: '12%', 
            height: '30%',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 70%, 60% 100%, 0% 90%, 10% 20%)'
          }}
        />
        
        {/* South America */}
        <div 
          className={`absolute ${isDark ? 'bg-red-600/30' : 'bg-red-400/50'} rounded-lg`}
          style={{ 
            left: '25%', 
            top: '45%', 
            width: '10%', 
            height: '35%',
            clipPath: 'polygon(30% 0%, 70% 10%, 100% 60%, 50% 100%, 0% 80%, 20% 20%)'
          }}
        />
        
        {/* Australia */}
        <div 
          className={`absolute ${isDark ? 'bg-purple-600/30' : 'bg-purple-400/50'} rounded-lg`}
          style={{ 
            left: '75%', 
            top: '65%', 
            width: '12%', 
            height: '15%',
            clipPath: 'polygon(0% 40%, 60% 0%, 100% 30%, 80% 100%, 20% 80%)'
          }}
        />
      </div>

      {/* Flight Markers */}
      {flights.map((flight, index) => {
        if (!flight.latitude || !flight.longitude) return null;

        // Convert lat/lng to screen coordinates (Mercator-like projection)
        const x = ((flight.longitude + 180) / 360) * 100;
        const y = ((90 - flight.latitude) / 180) * 100;
        
        const emissions = flight.emissions || {};
        const co2Rate = emissions.co2PerPassenger || 0;
        const isSelected = selectedFlight?.id === flight.id;
        
        // Color based on emissions
        const getEmissionColor = () => {
          if (co2Rate > 0.3) return '#ef4444' // Red - High
          if (co2Rate > 0.1) return '#f59e0b' // Yellow - Medium  
          return '#10b981' // Green - Low
        }

        const color = getEmissionColor()
        const size = isSelected ? 20 : 12

        return (
          <motion.div
            key={flight.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.01, duration: 0.3 }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 ${
              isSelected ? 'z-20' : ''
            }`}
            style={{
              left: `${Math.max(1, Math.min(99, x))}%`,
              top: `${Math.max(1, Math.min(99, y))}%`,
            }}
            onClick={() => onFlightSelect(flight)}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Flight Marker */}
            <div
              className={`rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                isSelected ? 'animate-pulse' : ''
              }`}
              style={{ 
                backgroundColor: color,
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: isSelected ? `0 0 20px ${color}, 0 0 40px ${color}50` : '0 2px 8px rgba(0,0,0,0.4)'
              }}
            >
              {/* Airplane Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                ✈
              </div>
            </div>
            
            {/* Flight Trail (for selected flight) */}
            {isSelected && (
              <div 
                className="absolute inset-0 rounded-full border-2 animate-ping"
                style={{ 
                  borderColor: color,
                  width: `${size + 10}px`,
                  height: `${size + 10}px`,
                  left: '-5px',
                  top: '-5px'
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Flight Info Panel */}
      <div className={`absolute top-4 left-4 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md ${textColor} rounded-lg p-4 border ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'} shadow-lg z-30`}>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">🛩️ LIVE TRACKING</span>
        </div>
        <div className="space-y-1 text-xs">
          <div>Flights: <span className="text-blue-400 font-mono">{flights.length}</span></div>
          <div>Style: <span className="text-blue-400 capitalize">{mapStyle}</span></div>
          <div>Heatmap: <span className={showHeatmap ? 'text-red-400' : 'text-gray-400'}>{showHeatmap ? 'ON' : 'OFF'}</span></div>
        </div>
      </div>

      {/* Global Stats */}
      <div className={`absolute top-4 right-4 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md ${textColor} rounded-lg p-4 border ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'} shadow-lg z-30`}>
        <h3 className="font-semibold mb-2 text-red-400">🌍 Global Emissions</h3>
        <div className="space-y-1 text-sm">
          <p>Active: <span className="text-blue-400">{flights.length}</span></p>
          <p>Avg CO₂: <span className="text-red-400">
            {flights.length > 0 ? (flights.reduce((sum, f) => sum + (f.emissions?.co2PerPassenger || 0), 0) / flights.length).toFixed(2) : 0}t
          </span></p>
          <p>Total: <span className="text-orange-400">
            {flights.reduce((sum, f) => sum + (f.emissions?.co2 || 0), 0).toFixed(1)}t
          </span></p>
        </div>
      </div>

      {/* Emissions Legend */}
      <div className={`absolute bottom-4 left-4 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md ${textColor} rounded-lg p-4 border ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'} shadow-lg z-30`}>
        <div className="text-sm font-semibold mb-3 text-blue-400">Emissions Level</div>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs">Low (&lt;0.1t CO₂/pax)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-xs">Medium (0.1-0.3t)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-xs">High (&gt;0.3t)</span>
          </div>
        </div>
      </div>

      {/* Selected Flight Info */}
      {selectedFlight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-4 right-4 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md ${textColor} rounded-lg p-4 border ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'} shadow-lg z-30 min-w-[250px]`}
        >
          <h3 className="font-bold text-lg mb-2 text-blue-400">{selectedFlight.callsign || 'Unknown Flight'}</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-blue-300">Aircraft:</span> {selectedFlight.aircraft || 'Unknown'}</p>
            <p><span className="text-blue-300">Route:</span> {selectedFlight.origin || 'N/A'} → {selectedFlight.destination || 'N/A'}</p>
            <p><span className="text-blue-300">Altitude:</span> {(selectedFlight.altitude || 0).toLocaleString()} ft</p>
            <p><span className="text-blue-300">Speed:</span> {selectedFlight.velocity || selectedFlight.speed || 0} km/h</p>
            <p><span className="text-red-400">CO₂ Rate:</span> {(selectedFlight.emissions?.co2PerPassenger || 0).toFixed(2)} t/passenger</p>
          </div>
        </motion.div>
      )}

      {/* Map Attribution */}
      <div className={`absolute bottom-2 right-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isDark ? 'bg-black/50' : 'bg-white/50'} px-2 py-1 rounded z-30`}>
        Simple Map • Carbon Emissions Tracker
      </div>
    </div>
  )
}

export default SimpleMapComponent
