# ✈️ Carbon Emissions Tracker

A real-time web application that tracks global airplane carbon emissions, providing live flight data, emissions calculations, and environmental impact analysis.

![Carbon Emissions Tracker](https://img.shields.io/badge/Status-Demo-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 🗺️ Live Flight Tracking
- Real-time global flight visualization
- Interactive world map with flight positions
- Aircraft information and flight paths
- Multiple map styles (satellite, streets, dark, light)

### 📊 Emissions Analysis
- Real-time CO₂ emissions calculations
- Per-flight and per-passenger emissions
- ICAO-standard methodology
- Aircraft-specific fuel consumption data

### 📈 Analytics Dashboard
- Global emissions statistics
- Airline and route comparisons
- Historical trends and patterns
- Top emitters leaderboard

### 🔍 Flight Search
- Search by flight number, airline, or route
- Detailed emission profiles
- Carbon offset recommendations
- Environmental impact comparisons

### 🎨 Modern UI/UX
- Dark/light mode support
- Responsive design for all devices
- Real-time data updates
- Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/carbon-emissions-tracker.git
   cd carbon-emissions-tracker
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
carbon-emissions-tracker/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── MapComponent.jsx     # Interactive map
│   │   ├── StatsCard.jsx        # Statistics cards
│   │   ├── EmissionsChart.jsx   # Charts and graphs
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── MapView.jsx          # Live map view
│   │   ├── Analytics.jsx        # Analytics page
│   │   ├── FlightSearch.jsx     # Flight search
│   │   └── About.jsx            # About page
│   ├── contexts/                # React contexts
│   │   ├── ThemeContext.jsx     # Theme management
│   │   └── FlightDataContext.jsx # Flight data state
│   ├── services/                # API services
│   │   └── api.js               # API client
│   ├── utils/                   # Utility functions
│   │   └── emissionsCalculator.js # Emissions calculations
│   └── ...
├── server/                      # Backend server
│   ├── index.js                 # Express server
│   └── package.json             # Server dependencies
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
└── README.md                    # This file
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time communication
- **Axios** - HTTP client

### Data Sources
- **OpenSky Network API** - Real-time flight data
- **ICAO Emissions Standards** - Calculation methodology
- **Aircraft Database** - Fuel consumption data

## 📊 Emissions Calculation

The application uses scientifically-backed methods to calculate CO₂ emissions:

### Methodology
1. **Aircraft Specifications**: Fuel burn rates by aircraft type
2. **Flight Distance**: Calculated from origin/destination coordinates
3. **Flight Time**: Estimated based on distance and average speed
4. **Load Factor**: Passenger capacity utilization (default 80%)
5. **Flight Phases**: Different fuel consumption for takeoff/landing vs cruise

### Formula
```
CO₂ Emissions = Fuel Consumption × 3.16 kg CO₂/kg fuel
Fuel Consumption = Flight Time × Adjusted Fuel Burn Rate
```

### Aircraft Data
- Boeing 737: 2.5 tons/hour fuel burn
- Airbus A320: 2.4 tons/hour fuel burn
- Boeing 777: 6.8 tons/hour fuel burn
- Airbus A350: 5.8 tons/hour fuel burn
- Boeing 787: 5.4 tons/hour fuel burn
- Airbus A380: 11.9 tons/hour fuel burn

## 🌍 Environmental Impact

### Key Metrics
- **Total CO₂ Emissions**: Real-time global aviation emissions
- **Per-Passenger Impact**: Individual carbon footprint
- **Carbon Offset Cost**: Price to neutralize emissions
- **Trees Required**: Number of trees needed for offset

### Comparisons
- Flight vs. train emissions
- Flight vs. car emissions
- Airline efficiency rankings
- Route optimization suggestions

## 🔌 API Endpoints

### Flight Data
- `GET /api/flights` - Get all active flights
- `GET /api/flights/:callsign` - Get specific flight details
- `GET /api/flights/search?q=query` - Search flights

### Emissions Data
- `GET /api/emissions/:timeframe` - Get emissions by timeframe
- `GET /api/airlines/stats` - Get airline statistics

### WebSocket Events
- `flightData` - Real-time flight updates
- `emissionsUpdate` - Emissions statistics updates

## 🎯 Use Cases

### For Travelers
- Compare flight emissions before booking
- Calculate personal carbon footprint
- Find carbon offset options
- Choose more efficient airlines/routes

### For Researchers
- Access real-time aviation emissions data
- Analyze global flight patterns
- Study environmental impact trends
- Export data for research

### For Airlines
- Monitor fleet efficiency
- Compare with industry benchmarks
- Identify optimization opportunities
- Track sustainability metrics

### For Policymakers
- Monitor aviation industry emissions
- Assess policy impact
- Set reduction targets
- Make data-driven decisions

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render/AWS)
```bash
cd server
npm start
```

### Environment Variables
Set the following in production:
- `VITE_API_URL` - Backend API URL
- `PORT` - Server port
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenSky Network** for providing free flight data
- **ICAO** for emissions calculation standards
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- 📧 Email: support@carbontracker.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/carbon-emissions-tracker/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/carbon-emissions-tracker/discussions)

---

**Built with ❤️ for a more sustainable future** 🌱
