import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plane, Layers, Settings } from 'lucide-react'
import { useFlightData } from '../contexts/FlightDataContext'
import FlightDetails from '../components/FlightDetails'

// Import Leaflet components
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create airplane icon for flights
const createAirplaneIcon = (co2Rate, isSelected = false) => {
  const color = co2Rate > 0.3 ? '#ef4444' : co2Rate > 0.1 ? '#f59e0b' : '#10b981';
  const size = isSelected ? 20 : 14;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.5}px;
        color: white;
        font-weight: bold;
        animation: pulse 2s infinite;
      ">
        ✈
      </div>
    `,
    className: 'airplane-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

const MapView = () => {
  console.log('🗺️ MapView component is rendering!')

  // Get flight data
  const { flights, loading } = useFlightData()

  // State for map controls
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [mapStyle, setMapStyle] = useState('dark')

  // Performance optimization: limit flights for smooth rendering
  const optimizedFlights = useMemo(() => {
    return flights.slice(0, 200) // Increased to show more realistic flight traffic
  }, [flights])

  // Get tile layer URL based on style
  const getTileLayerUrl = (style) => {
    const styles = {
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    };
    return styles[style] || styles.dark;
  };

  // Get attribution
  const getAttribution = (style) => {
    const attributions = {
      satellite: '&copy; <a href="https://www.esri.com/">Esri</a>',
      streets: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      light: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    };
    return attributions[style] || attributions.dark;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-3 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {optimizedFlights.length} flights
            </span>
            {loading && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </div>

          {/* Map Style Selector */}
          <div className="flex space-x-1">
            {['dark', 'streets', 'satellite', 'light'].map((style) => (
              <button
                key={style}
                onClick={() => setMapStyle(style)}
                className={`px-2 py-1 text-xs rounded ${
                  mapStyle === style
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative h-screen">
        {/* Map */}
        <div className={`transition-all duration-300 ${selectedFlight ? 'mr-80' : ''}`}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100vh', width: '100%' }}
            className="z-0"
            key={mapStyle} // Force re-render when style changes
          >
          {/* Tile Layer */}
          <TileLayer
            url={getTileLayerUrl(mapStyle)}
            attribution={getAttribution(mapStyle)}
          />

          {/* Flight Markers */}
          {optimizedFlights.map((flight) => {
            if (!flight.latitude || !flight.longitude) return null;

            const emissions = flight.emissions || {};
            const co2Rate = emissions.co2PerPassenger || 0;
            const isSelected = selectedFlight?.id === flight.id;

            return (
              <Marker
                key={flight.id}
                position={[flight.latitude, flight.longitude]}
                icon={createAirplaneIcon(co2Rate, isSelected)}
                eventHandlers={{
                  click: () => setSelectedFlight(flight)
                }}
              >
                <Popup>
                  <div className="p-3 bg-gray-900 text-white rounded-lg min-w-[280px]">
                    <h3 className="font-bold text-lg mb-3 text-blue-400 border-b border-gray-700 pb-2">
                      ✈️ {flight.callsign || 'Unknown Flight'}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-300">Aircraft:</span>
                        <span className="font-medium">{flight.aircraft || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Route:</span>
                        <span className="font-medium">{flight.origin || 'N/A'} → {flight.destination || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Altitude:</span>
                        <span className="font-medium">{(flight.altitude || 0).toLocaleString()} ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Speed:</span>
                        <span className="font-medium">{flight.velocity || flight.speed || 0} kts</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                        <span className="text-red-400">CO₂ Rate:</span>
                        <span className="font-bold text-red-300">{co2Rate.toFixed(2)} t/passenger</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Emissions Level
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-700 dark:text-gray-300">Low (&lt;0.1t per passenger)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-xs text-gray-700 dark:text-gray-300">Medium (0.1-0.3t)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-gray-700 dark:text-gray-300">High (&gt;0.3t)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400 flex items-center">
              🌍 Global Emissions
            </h3>
            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <p>Active: <span className="text-blue-600 dark:text-blue-400 font-medium">{optimizedFlights.length}</span></p>
              <p>Total: <span className="text-orange-600 dark:text-orange-400 font-medium">
                {optimizedFlights.reduce((sum, f) => sum + (f.emissions?.co2 || 0), 0).toFixed(1)}t CO₂
              </span></p>
              <p>Avg/pax: <span className="text-red-600 dark:text-red-400 font-medium">
                {optimizedFlights.length > 0 ?
                  (optimizedFlights.reduce((sum, f) => sum + (f.emissions?.co2PerPassenger || 0), 0) / optimizedFlights.length).toFixed(2)
                  : '0.00'}t
              </span></p>
            </div>
          </div>
        </div>

        {/* Map Style Info */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <Settings className="h-4 w-4" />
              <span>Style: <span className="font-medium capitalize">{mapStyle}</span></span>
            </div>
          </div>
        </div>

        {/* Flight Details Panel */}
        {selectedFlight && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="absolute top-0 right-0 z-20 h-full w-80"
          >
            <FlightDetails
              flight={selectedFlight}
              onClose={() => setSelectedFlight(null)}
            />
          </motion.div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .airplane-marker div {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  )

}

export default MapView
