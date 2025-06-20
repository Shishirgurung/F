import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plane,
  BarChart3,
  Map,
  Search,
  Info,
  Sun,
  Moon,
  Menu,
  X,
  Activity,
  Monitor
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useFlightData } from '../contexts/FlightDataContext'
import { useAdDemo } from '../contexts/AdDemoContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { lastUpdate, loading } = useFlightData()
  const { isAdminAuthenticated } = useAdDemo()
  const location = useLocation()

  // Base navigation items (always visible)
  const baseNavItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/map', label: 'Live Map', icon: Map },
    { path: '/analytics', label: 'Analytics', icon: Activity },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/about', label: 'About', icon: Info }
  ]

  // Admin-only navigation items
  const adminNavItems = [
    { path: '/ad-demo', label: 'Ad Demo', icon: Monitor }
  ]

  // Combine navigation items based on admin status
  const navItems = isAdminAuthenticated
    ? [...baseNavItems.slice(0, -1), ...adminNavItems, baseNavItems[baseNavItems.length - 1]]
    : baseNavItems

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-primary-500 rounded-lg"
            >
              <Plane className="h-6 w-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Carbon Tracker
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time Aviation Emissions
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Status and Controls */}
          <div className="flex items-center space-x-4">
            {/* Live Status */}
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-gray-600 dark:text-gray-400">
                {loading ? 'Updating...' : `Updated ${lastUpdate.toLocaleTimeString()}`}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            
            {/* Mobile Status */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 px-3 text-xs text-gray-600 dark:text-gray-400">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                <span>{loading ? 'Updating data...' : `Last updated: ${lastUpdate.toLocaleTimeString()}`}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
