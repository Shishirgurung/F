import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import MapView from './pages/MapView'
import Analytics from './pages/Analytics'
import FlightSearch from './pages/FlightSearch'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AdDemo from './pages/AdDemo'
import { ThemeProvider } from './contexts/ThemeContext'
import { FlightDataProvider } from './contexts/FlightDataContext'
import { AdDemoProvider, useAdDemo } from './contexts/AdDemoContext'
import LoadingScreen from './components/LoadingScreen'
import AdminDemoPanel from './components/AdDemo/AdminDemoPanel'

// Component to conditionally render admin panel
const ConditionalAdminPanel = () => {
  const { isAdminAuthenticated } = useAdDemo()
  const [showAdminAccess, setShowAdminAccess] = useState(false)
  const [setupCode, setSetupCode] = useState('')
  const [showSetupPrompt, setShowSetupPrompt] = useState(false)

  // Your custom setup code - change this to whatever you want
  const SETUP_CODE = 'Shishirgrg'

  // Check for admin access URL parameter or key combination
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const adminParam = urlParams.get('admin')
    const setupParam = urlParams.get('setup')

    // Show admin panel if already authenticated, admin URL parameter, or setup code
    if (isAdminAuthenticated || adminParam === 'true') {
      setShowAdminAccess(true)
    }

    // Check for setup code in URL
    if (setupParam === SETUP_CODE) {
      setShowAdminAccess(true)
      localStorage.setItem('adminSetupUnlocked', 'true')
    }

    // Check if setup was previously unlocked
    if (localStorage.getItem('adminSetupUnlocked') === 'true') {
      setShowAdminAccess(true)
    }

    // Listen for special key combinations
    const handleKeyDown = (e) => {
      // Ctrl+Shift+A for admin access
      if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        setShowAdminAccess(true)
      }

      // Ctrl+Shift+S for setup code prompt
      if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        setShowSetupPrompt(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAdminAuthenticated])

  // Handle setup code submission
  const handleSetupCodeSubmit = (e) => {
    e.preventDefault()
    if (setupCode.toUpperCase() === SETUP_CODE) {
      setShowAdminAccess(true)
      setShowSetupPrompt(false)
      setSetupCode('')
      localStorage.setItem('adminSetupUnlocked', 'true')
      alert('Admin access unlocked! Settings icon is now visible.')
    } else {
      alert('Invalid setup code. Please try again.')
      setSetupCode('')
    }
  }

  // Setup code prompt modal
  const SetupPrompt = () => (
    showSetupPrompt && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔧 Admin Setup Code
          </h3>
          <form onSubmit={handleSetupCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Setup Code
              </label>
              <input
                type="text"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your setup code"
                autoComplete="off"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Unlock Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSetupPrompt(false)
                  setSetupCode('')
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              💡 <strong>Hint:</strong> The setup code is related to your app name and year
            </p>
          </div>
        </div>
      </div>
    )
  )

  return (
    <>
      <SetupPrompt />
      {/* Only show admin panel if access is granted */}
      {showAdminAccess && <AdminDemoPanel />}
    </>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <FlightDataProvider>
        <AdDemoProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-16"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/search" element={<FlightSearch />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/ad-demo" element={<AdDemo />} />
              </Routes>
            </motion.main>

            {/* Admin Demo Panel - Conditionally available */}
            <ConditionalAdminPanel />

            {/* Footer */}
            <Footer />
          </div>
        </AdDemoProvider>
      </FlightDataProvider>
    </ThemeProvider>
  )
}

export default App
