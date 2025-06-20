// GDPR-Compliant Cookie Consent Component
// Handles user consent for analytics and advertising cookies

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, BarChart3, DollarSign, X } from 'lucide-react'
import analytics, { grantAnalyticsConsent, denyAnalyticsConsent } from '../utils/analytics'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    advertising: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    const consentDate = localStorage.getItem('cookie-consent-date')
    
    if (!consent || isConsentExpired(consentDate)) {
      setShowBanner(true)
    } else {
      // Apply saved preferences
      const savedPreferences = JSON.parse(localStorage.getItem('cookie-preferences') || '{}')
      setPreferences(prev => ({ ...prev, ...savedPreferences }))
      
      // Initialize services based on saved consent
      if (savedPreferences.analytics) {
        grantAnalyticsConsent()
      }
    }
  }, [])

  const isConsentExpired = (consentDate) => {
    if (!consentDate) return true
    const oneYear = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
    return Date.now() - new Date(consentDate).getTime() > oneYear
  }

  const saveConsent = (accepted, customPreferences = null) => {
    const finalPreferences = customPreferences || preferences
    
    localStorage.setItem('cookie-consent', accepted ? 'granted' : 'denied')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    localStorage.setItem('cookie-preferences', JSON.stringify(finalPreferences))
    
    // Apply consent to services
    if (finalPreferences.analytics) {
      grantAnalyticsConsent()
      analytics.trackEvent('Cookie Consent', 'Privacy', 'Analytics Granted')
    } else {
      denyAnalyticsConsent()
    }
    
    setShowBanner(false)
    setShowDetails(false)
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true
    }
    setPreferences(allAccepted)
    saveConsent(true, allAccepted)
  }

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      advertising: false,
      functional: false
    }
    setPreferences(onlyNecessary)
    saveConsent(false, onlyNecessary)
  }

  const saveCustomPreferences = () => {
    saveConsent(true, preferences)
  }

  const handlePreferenceChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const cookieTypes = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      description: 'Essential for the website to function properly. Cannot be disabled.',
      icon: Shield,
      required: true,
      examples: 'Session management, security, basic functionality'
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false,
      examples: 'Google Analytics, page views, user behavior'
    },
    {
      id: 'advertising',
      name: 'Advertising Cookies',
      description: 'Used to show relevant ads and measure ad performance.',
      icon: DollarSign,
      required: false,
      examples: 'Google AdSense, targeted ads, conversion tracking'
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization.',
      icon: Cookie,
      required: false,
      examples: 'Theme preferences, language settings, user preferences'
    }
  ]

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cookie className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cookie Preferences
                </h2>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We use cookies to enhance your experience, analyze site traffic, and serve personalized ads. 
              Choose your preferences below.
            </p>
          </div>

          {/* Cookie Types */}
          <div className="p-6 space-y-4">
            {cookieTypes.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {type.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Examples: {type.examples}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      {type.required ? (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          Required
                        </span>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences[type.id]}
                            onChange={(e) => handlePreferenceChange(type.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Accept All Cookies
              </button>
              <button
                onClick={saveCustomPreferences}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Save My Preferences
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Reject All
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can change your preferences at any time in the privacy settings. 
                <br />
                For more information, see our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/cookie-policy" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Cookie Settings Button (for footer or settings page)
export const CookieSettingsButton = ({ className = '' }) => {
  const [showConsent, setShowConsent] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowConsent(true)}
        className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
      >
        <Cookie className="h-4 w-4" />
        <span>Cookie Settings</span>
      </button>
      {showConsent && <CookieConsent />}
    </>
  )
}

export default CookieConsent
