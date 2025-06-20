# 🚀 Setup Guide - Carbon Emissions Tracker

This guide will help you set up and run the Carbon Emissions Tracker application on your local machine.

## 📋 Prerequisites

### 1. Install Node.js

**Option A: Download from Official Website (Recommended)**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version (Long Term Support)
3. Run the installer and follow the setup wizard
4. Restart your computer after installation

**Option B: Using Package Manager (Advanced)**
- **Windows (Chocolatey)**: `choco install nodejs`
- **Windows (Winget)**: `winget install OpenJS.NodeJS`

### 2. Verify Installation

Open Command Prompt or PowerShell and run:
```bash
node --version
npm --version
```

You should see version numbers (e.g., v18.17.0 and 9.6.7).

## 🛠️ Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd "OneDrive\Desktop\Carbon emisson"
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

This will install all the required packages for the React frontend.

### Step 3: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

This installs the Node.js server dependencies.

### Step 4: Set Up Environment Variables (Optional)
```bash
copy .env.example .env
```

Edit the `.env` file if you want to customize settings.

## 🚀 Running the Application

### Option 1: Automatic Startup (Windows)
Double-click the `start.bat` file in the project folder. This will:
- Install dependencies (if not already installed)
- Start both frontend and backend servers
- Open terminal windows for each server

### Option 2: Manual Startup

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend Server:**
```bash
npm run dev
```

### Step 5: Access the Application

Once both servers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🌐 Application Features

### Dashboard (http://localhost:3000)
- Real-time flight statistics
- Global emissions overview
- Live data feed
- Environmental impact metrics

### Live Map (http://localhost:3000/map)
- Interactive world map
- Real-time flight positions
- Emissions visualization
- Flight filtering options

### Analytics (http://localhost:3000/analytics)
- Detailed emissions analysis
- Airline comparisons
- Historical trends
- Export capabilities

### Flight Search (http://localhost:3000/search)
- Search specific flights
- Detailed emission profiles
- Carbon offset calculations

## 🔧 Troubleshooting

### Common Issues

**1. "node is not recognized as an internal or external command"**
- Node.js is not installed or not in PATH
- Restart your computer after installing Node.js
- Try reinstalling Node.js

**2. "npm install" fails**
- Check your internet connection
- Try running as administrator
- Clear npm cache: `npm cache clean --force`

**3. Port already in use**
- Close other applications using ports 3000 or 5000
- Or change ports in `vite.config.js` and `server/index.js`

**4. "Cannot find module" errors**
- Delete `node_modules` folders and run `npm install` again
- Make sure you're in the correct directory

### Performance Tips

**For Better Performance:**
1. Close unnecessary applications
2. Use a modern browser (Chrome, Firefox, Edge)
3. Ensure stable internet connection for real-time data

**For Development:**
1. Install VS Code for better code editing
2. Install React Developer Tools browser extension
3. Use Chrome DevTools for debugging

## 📊 Demo Data

The application uses demo flight data by default because:
- Real flight APIs require authentication
- Demo data shows all features working
- No external dependencies needed

**Demo Features:**
- 100 simulated flights
- Real-time position updates
- Accurate emissions calculations
- All UI components functional

## 🔄 Real Data Integration

To use real flight data (optional):

1. **Get OpenSky Network Account**
   - Sign up at [opensky-network.org](https://opensky-network.org)
   - Get API credentials

2. **Update Environment Variables**
   ```
   OPENSKY_USERNAME=your_username
   OPENSKY_PASSWORD=your_password
   ```

3. **Modify API Service**
   - Edit `src/services/api.js`
   - Uncomment real API calls
   - Add authentication headers

## 🎨 Customization

### Themes
- Toggle dark/light mode in the top navigation
- Customize colors in `tailwind.config.js`

### Map Styles
- Change map appearance in the Live Map view
- Options: Satellite, Streets, Dark, Light

### Data Refresh Rate
- Modify update interval in `server/index.js`
- Default: 30 seconds

## 📱 Mobile Support

The application is fully responsive:
- Works on phones and tablets
- Touch-friendly interface
- Optimized layouts for small screens

## 🔒 Security Notes

**For Production Deployment:**
1. Use environment variables for API keys
2. Enable CORS restrictions
3. Add rate limiting
4. Use HTTPS
5. Implement authentication

## 📞 Getting Help

**If you encounter issues:**

1. **Check the Console**
   - Open browser Developer Tools (F12)
   - Look for error messages in Console tab

2. **Check Server Logs**
   - Look at the terminal running the backend server
   - Error messages will appear there

3. **Common Solutions**
   - Restart both servers
   - Clear browser cache
   - Check internet connection
   - Verify Node.js installation

4. **Contact Support**
   - Create an issue on GitHub
   - Include error messages and steps to reproduce

## 🎯 Next Steps

Once the application is running:

1. **Explore the Dashboard** - See real-time emissions data
2. **Try the Live Map** - Watch flights move in real-time
3. **Search for Flights** - Look up specific airlines or routes
4. **Check Analytics** - View detailed emissions analysis
5. **Learn About the Project** - Read the About page

## 🌟 Success!

If you see the Carbon Emissions Tracker dashboard with live flight data, you've successfully set up the application! 

The demo shows:
- ✅ Real-time flight tracking
- ✅ CO₂ emissions calculations  
- ✅ Interactive world map
- ✅ Analytics and insights
- ✅ Flight search functionality

Enjoy exploring aviation emissions data! 🛩️🌍
