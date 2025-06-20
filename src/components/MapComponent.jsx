import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Try to import Leaflet, but provide fallback if it fails
let MapContainer, TileLayer, Marker, Popup, Polyline, L
let leafletAvailable = true

try {
  const leafletComponents = require('react-leaflet')
  MapContainer = leafletComponents.MapContainer
  TileLayer = leafletComponents.TileLayer
  Marker = leafletComponents.Marker
  Popup = leafletComponents.Popup
  Polyline = leafletComponents.Polyline
  L = require('leaflet')
  require('leaflet/dist/leaflet.css')
} catch (error) {
  console.warn('Leaflet not available, using fallback map:', error)
  leafletAvailable = false
}

// Fix for default markers in React Leaflet (only if Leaflet is available)
if (leafletAvailable && L) {
  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  } catch (error) {
    console.warn('Error setting up Leaflet icons:', error)
  }
}

// Create custom airplane icon for Leaflet
const createAirplaneIcon = (heading, co2Rate, isSelected = false) => {
  const color = co2Rate > 0.3 ? '#ef4444' : co2Rate > 0.1 ? '#f59e0b' : '#10b981';
  const size = isSelected ? 28 : 20;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        transform: rotate(${heading}deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        ${isSelected ? 'box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);' : ''}
      ">
        <div style="
          width: ${size * 0.3}px;
          height: ${size * 0.3}px;
          background: white;
          border-radius: 50%;
        "></div>
        ${isSelected ? `
          <div style="
            position: absolute;
            width: ${size + 12}px;
            height: ${size + 12}px;
            border: 2px solid #3B82F6;
            border-radius: 50%;
            top: -8px;
            left: -8px;
            animation: pulse 2s infinite;
          "></div>
        ` : ''}
      </div>
    `,
    className: 'custom-airplane-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Get tile layer URL based on map style
const getTileLayerUrl = (style) => {
  const styles = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
  };
  return styles[style] || styles.dark;
};

// Get attribution based on map style
const getAttribution = (style) => {
  const attributions = {
    satellite: '&copy; <a href="https://www.esri.com/">Esri</a>',
    streets: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    light: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  };
  return attributions[style] || attributions.dark;
};

// Function to get airport coordinates from flight data
const getAirportCoordinates = (airportName) => {
  // Comprehensive airport database matching our flight data
  const airportCoords = {
    // North America
    'New York JFK': [40.6413, -73.7781],
    'Los Angeles LAX': [34.0522, -118.2437],
    'Chicago ORD': [41.9742, -87.9073],
    'Dallas DFW': [32.8968, -97.0380],
    'Atlanta ATL': [33.6407, -84.4277],
    'Miami MIA': [25.7959, -80.2870],
    'San Francisco SFO': [37.6213, -122.3790],
    'Seattle SEA': [47.4502, -122.3088],
    'Boston BOS': [42.3656, -71.0096],
    'Las Vegas LAS': [36.0840, -115.1537],
    'Toronto YYZ': [43.6777, -79.6248],
    'Vancouver YVR': [49.1967, -123.1815],
    'Montreal YUL': [45.4706, -73.7408],
    'Mexico City MEX': [19.4363, -99.0721],
    'Cancun CUN': [21.0365, -86.8771],

    // Europe
    'London Heathrow LHR': [51.4700, -0.4543],
    'London Gatwick LGW': [51.1537, -0.1821],
    'Paris CDG': [49.0097, 2.5479],
    'Paris Orly ORY': [48.7233, 2.3794],
    'Frankfurt FRA': [50.0379, 8.5622],
    'Munich MUC': [48.3537, 11.7751],
    'Berlin BER': [52.3667, 13.5033],
    'Amsterdam AMS': [52.3105, 4.7683],
    'Madrid MAD': [40.4839, -3.5680],
    'Barcelona BCN': [41.2974, 2.0833],
    'Rome FCO': [41.8003, 12.2389],
    'Milan MXP': [45.6306, 8.7231],
    'Zurich ZUR': [47.4647, 8.5492],
    'Vienna VIE': [48.1103, 16.5697],
    'Brussels BRU': [50.9014, 4.4844],
    'Copenhagen CPH': [55.6181, 12.6561],
    'Stockholm ARN': [59.6519, 17.9186],
    'Oslo OSL': [60.1939, 11.1004],
    'Helsinki HEL': [60.3172, 24.9633],
    'Warsaw WAW': [52.1657, 20.9671],
    'Prague PRG': [50.1008, 14.2632],
    'Budapest BUD': [47.4394, 19.2611],
    'Athens ATH': [37.9364, 23.9445],
    'Lisbon LIS': [38.7813, -9.1363],
    'Dublin DUB': [53.4213, -6.2701],
    'Istanbul IST': [40.9769, 28.8146],
    'Moscow SVO': [55.9726, 37.4146],
    'St Petersburg LED': [59.8003, 30.2625],

    // Asia Pacific
    'Tokyo Haneda HND': [35.5494, 139.7798],
    'Tokyo Narita NRT': [35.7720, 140.3929],
    'Osaka KIX': [34.4347, 135.2441],
    'Beijing PEK': [40.0799, 116.6031],
    'Shanghai PVG': [31.1979, 121.3364],
    'Guangzhou CAN': [23.3924, 113.2988],
    'Shenzhen SZX': [22.6393, 113.8107],
    'Hong Kong HKG': [22.3080, 113.9185],
    'Seoul ICN': [37.4602, 126.4407],
    'Busan PUS': [35.1795, 128.9382],
    'Singapore SIN': [1.3644, 103.9915],
    'Bangkok BKK': [13.6900, 100.7501],
    'Kuala Lumpur KUL': [2.7456, 101.7072],
    'Jakarta CGK': [-6.1256, 106.6559],
    'Manila MNL': [14.5086, 121.0194],
    'Ho Chi Minh SGN': [10.8188, 106.6519],
    'Hanoi HAN': [21.2187, 105.8070],
    'Sydney SYD': [-33.9399, 151.1753],
    'Melbourne MEL': [-37.6690, 144.8410],
    'Brisbane BNE': [-27.3942, 153.1218],
    'Perth PER': [-31.9403, 115.9669],
    'Auckland AKL': [-37.0082, 174.7850],
    'Delhi DEL': [28.5562, 77.1000],
    'Mumbai BOM': [19.0896, 72.8656],
    'Bangalore BLR': [13.1986, 77.7066],
    'Chennai MAA': [12.9941, 80.1709],
    'Kolkata CCU': [22.6546, 88.4467],
    'Islamabad ISB': [33.6149, 73.0993],
    'Karachi KHI': [24.9056, 67.1608],
    'Dhaka DAC': [23.8433, 90.3978],
    'Kathmandu KTM': [27.6966, 85.3591],
    'Colombo CMB': [7.1808, 79.8841],

    // Middle East
    'Dubai DXB': [25.2532, 55.3657],
    'Abu Dhabi AUH': [24.4330, 54.6511],
    'Doha DOH': [25.2731, 51.6080],
    'Kuwait KWI': [29.2267, 47.9689],
    'Riyadh RUH': [24.9576, 46.6988],
    'Jeddah JED': [21.6796, 39.1565],
    'Tehran IKA': [35.4161, 51.1522],
    'Tel Aviv TLV': [32.0114, 34.8867],
    'Amman AMM': [31.7226, 35.9932],
    'Beirut BEY': [33.8209, 35.4884],

    // Africa
    'Johannesburg JNB': [-26.1367, 28.2411],
    'Cape Town CPT': [-33.9715, 18.6021],
    'Cairo CAI': [30.1219, 31.4056],
    'Addis Ababa ADD': [8.9806, 38.7992],
    'Lagos LOS': [6.5774, 3.3212],
    'Abuja ABV': [9.0068, 7.2631],
    'Nairobi NBO': [-1.3192, 36.9278],
    'Casablanca CMN': [33.3675, -7.5898],
    'Tunis TUN': [36.8510, 10.2272],
    'Algiers ALG': [36.6910, 3.2155],
    'Accra ACC': [5.6052, -0.1668],
    'Dakar DKR': [14.7397, -17.4902],

    // South America
    'São Paulo GRU': [-23.4356, -46.4731],
    'Rio de Janeiro GIG': [-22.8099, -43.2505],
    'Brasília BSB': [-15.8697, -47.9208],
    'Buenos Aires EZE': [-34.8222, -58.5358],
    'Santiago SCL': [-33.3927, -70.7854],
    'Lima LIM': [-12.0219, -77.1143],
    'Bogotá BOG': [4.7016, -74.1469],
    'Caracas CCS': [10.6013, -66.9911],
    'Quito UIO': [-0.1292, -78.3575],
    'La Paz LPB': [-16.5133, -68.1925],
    'Montevideo MVD': [-34.8384, -56.0308],
    'Asunción ASU': [-25.2398, -57.5199],

    // Central America & Caribbean
    'Panama City PTY': [9.0714, -79.3834],
    'San José SJO': [9.9939, -84.2088],
    'Guatemala City GUA': [14.5833, -90.5275],
    'Havana HAV': [22.9892, -82.4091],
    'Kingston KIN': [17.9357, -76.7875],
    'Santo Domingo SDQ': [18.4297, -69.6689],

    // Central Asia
    'Tashkent TAS': [41.2579, 69.2811],
    'Almaty ALA': [43.3521, 77.0405],
    'Baku GYD': [40.4675, 50.0467],
    'Tbilisi TBS': [41.6692, 44.9547],
    'Yerevan EVN': [40.1473, 44.3959]
  };

  // Try to find exact match first
  if (airportCoords[airportName]) {
    return airportCoords[airportName];
  }

  // Try to find partial match
  for (const [airport, coords] of Object.entries(airportCoords)) {
    if (airport.toLowerCase().includes(airportName.toLowerCase()) ||
        airportName.toLowerCase().includes(airport.toLowerCase())) {
      return coords;
    }
  }

  return null;
};

// Function to create curved flight path between two points
const createFlightPath = (originCoords, destCoords, currentPos) => {
  if (!originCoords || !destCoords) return [];

  const [originLat, originLng] = originCoords;
  const [destLat, destLng] = destCoords;
  const [currentLat, currentLng] = currentPos;

  // Create a curved path using intermediate points
  const points = [];
  const numPoints = 20; // Number of points for smooth curve

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    // Simple great circle interpolation with slight curve
    const lat = originLat + (destLat - originLat) * t;
    const lng = originLng + (destLng - originLng) * t;

    // Add slight curve for visual appeal (simulate great circle route)
    const curveFactor = Math.sin(t * Math.PI) * 0.1;
    const curvedLat = lat + curveFactor * (Math.abs(destLat - originLat));

    points.push([curvedLat, lng]);
  }

  return points;
};

// Function to get flight path color based on emissions
const getFlightPathColor = (co2Rate) => {
  if (co2Rate > 0.3) return '#ef4444'; // Red - High emissions
  if (co2Rate > 0.1) return '#f59e0b'; // Yellow - Medium emissions
  return '#10b981'; // Green - Low emissions
};

const MapComponent = ({
  flights,
  selectedFlight,
  onFlightSelect,
  mapStyle,
  showHeatmap,
  isFullscreen
}) => {
  const [mapLoaded, setMapLoaded] = useState(true) // Leaflet loads faster
  const [showFlightPaths, setShowFlightPaths] = useState(true) // Show flight paths by default





  return (
    <div className="relative w-full h-full">
      {/* Leaflet Map Container */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        key={mapStyle} // Force re-render when style changes
      >
        {/* Tile Layer based on selected style */}
        <TileLayer
          url={getTileLayerUrl(mapStyle)}
          attribution={getAttribution(mapStyle)}
        />

        {/* Flight Paths */}
        {showFlightPaths && flights.map((flight) => {
          if (!flight.latitude || !flight.longitude || !flight.origin || !flight.destination) return null;

          const originCoords = getAirportCoordinates(flight.origin);
          const destCoords = getAirportCoordinates(flight.destination);
          const currentPos = [flight.latitude, flight.longitude];

          if (!originCoords || !destCoords) return null;

          const pathPoints = createFlightPath(originCoords, destCoords, currentPos);
          const emissions = flight.emissions || {};
          const co2Rate = emissions.co2PerPassenger || 0;
          const pathColor = getFlightPathColor(co2Rate);

          return (
            <Polyline
              key={`path-${flight.id}`}
              positions={pathPoints}
              color={pathColor}
              weight={2}
              opacity={0.6}
              dashArray="5, 10"
            />
          );
        })}

        {/* Flight Markers */}
        {flights.map((flight) => {
          if (!flight.latitude || !flight.longitude) return null;

          const emissions = flight.emissions || {};
          const co2Rate = emissions.co2PerPassenger || 0;
          const isSelected = selectedFlight?.id === flight.id;

          return (
            <Marker
              key={flight.id}
              position={[flight.latitude, flight.longitude]}
              icon={createAirplaneIcon(flight.heading || 0, co2Rate, isSelected)}
              eventHandlers={{
                click: () => onFlightSelect(flight)
              }}
            >
              <Popup>
                <div className="p-2 bg-gray-900 text-white rounded-lg min-w-[250px]">
                  <h3 className="font-bold text-lg mb-2 text-blue-400">{flight.callsign || 'Unknown Flight'}</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-blue-300">Aircraft:</span> {flight.aircraft || 'Unknown'}</p>
                    <p><span className="text-blue-300">Route:</span> {flight.origin || 'N/A'} → {flight.destination || 'N/A'}</p>
                    <p><span className="text-blue-300">Altitude:</span> {(flight.altitude || 0).toLocaleString()} ft</p>
                    <p><span className="text-blue-300">Speed:</span> {flight.velocity || flight.speed || 0} kts</p>
                    <p><span className="text-red-400">CO₂ Rate:</span> {co2Rate.toFixed(2)} t/passenger</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-white">Loading Earth view...</span>
        </div>
      )}

      {/* Flightradar24-style info panel */}
      <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-md text-white rounded-lg p-4 border border-gray-700/50 shadow-lg z-10">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">🛩️ LIVE TRACKING</span>
        </div>
        <div className="space-y-1 text-xs">
          <div>Flights tracked: <span className="text-yellow-400 font-mono">{flights.length}</span></div>
          <div>Map style: <span className="text-blue-400 capitalize">{mapStyle}</span></div>
          <div>Heatmap: <span className={showHeatmap ? 'text-red-400' : 'text-gray-400'}>{showHeatmap ? 'ON' : 'OFF'}</span></div>
          <div className="flex items-center justify-between">
            <span>Flight paths:</span>
            <button
              onClick={() => setShowFlightPaths(!showFlightPaths)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                showFlightPaths
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {showFlightPaths ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Emissions legend - Flightradar24 style */}
      <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-md text-white rounded-lg p-4 border border-gray-700/50 shadow-lg z-10">
        <div className="text-sm font-semibold mb-3 text-blue-400">Emissions Level</div>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs">Low (&lt;0.1t CO₂/pax)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs">Medium (0.1-0.3t)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs">High (&gt;0.3t)</span>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-md text-white rounded-lg p-4 border border-gray-700/50 shadow-lg z-10">
        <h3 className="font-semibold mb-2 text-red-400">🌍 Global Emissions</h3>
        <div className="space-y-1 text-sm">
          <p>Current Rate: <span className="text-red-400 font-bold">
            {flights.reduce((sum, f) => sum + (f.emissions?.co2PerPassenger || 0), 0).toFixed(1)} t/min
          </span></p>
          <p>Daily Estimate: <span className="text-orange-400">
            {(flights.reduce((sum, f) => sum + (f.emissions?.co2PerPassenger || 0), 0) * 1440).toFixed(0)} t/day
          </span></p>
          <p>Active Aircraft: <span className="text-blue-400">{flights.length}</span></p>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded z-10">
        © OpenStreetMap • Carbon Emissions Tracker
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .custom-airplane-icon div:last-child {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default MapComponent
