// Google Analytics 4 (GA4) Integration
// Comprehensive visitor tracking and event analytics

import ReactGA from 'react-ga4'

class AnalyticsManager {
  constructor() {
    this.isInitialized = false
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID
    this.debugMode = import.meta.env.NODE_ENV === 'development'
    this.consentGiven = false
  }

  // Initialize Google Analytics
  initialize() {
    if (!this.trackingId) {
      console.warn('Google Analytics tracking ID not found. Please set VITE_GA_TRACKING_ID in your .env file')
      return false
    }

    try {
      ReactGA.initialize(this.trackingId, {
        debug: this.debugMode,
        titleCase: false,
        gaOptions: {
          send_page_view: false // We'll send page views manually
        }
      })

      this.isInitialized = true
      console.log('✅ Google Analytics initialized successfully')
      
      // Track initial page load
      this.trackPageView()
      
      return true
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error)
      return false
    }
  }

  // Check if user has given consent (GDPR compliance)
  checkConsent() {
    const consent = localStorage.getItem('analytics-consent')
    this.consentGiven = consent === 'granted'
    return this.consentGiven
  }

  // Grant consent and initialize
  grantConsent() {
    localStorage.setItem('analytics-consent', 'granted')
    this.consentGiven = true
    if (!this.isInitialized) {
      this.initialize()
    }
  }

  // Deny consent
  denyConsent() {
    localStorage.setItem('analytics-consent', 'denied')
    this.consentGiven = false
  }

  // Track page views
  trackPageView(path = null) {
    if (!this.isInitialized || !this.consentGiven) return

    const page = path || window.location.pathname + window.location.search

    ReactGA.send({
      hitType: 'pageview',
      page: page,
      title: document.title
    })

    console.log(`📊 Page view tracked: ${page}`)
  }

  // Track custom events
  trackEvent(action, category = 'General', label = null, value = null) {
    if (!this.isInitialized || !this.consentGiven) return

    const eventData = {
      action: action,
      category: category
    }

    if (label) eventData.label = label
    if (value) eventData.value = value

    ReactGA.event(eventData)
    console.log(`📊 Event tracked:`, eventData)
  }

  // Aviation-specific tracking methods
  trackFlightInteraction(action, flightData = {}) {
    this.trackEvent(action, 'Flight Interaction', flightData.callsign, flightData.emissions?.co2)
  }

  trackMapInteraction(action, details = null) {
    this.trackEvent(action, 'Map Interaction', details)
  }

  trackAdInteraction(action, adType, company = null) {
    this.trackEvent(action, 'Advertisement', `${adType}-${company}`)
  }

  trackDataSourceSwitch(newSource) {
    this.trackEvent('Data Source Switch', 'Data Management', newSource)
  }

  trackEmissionsCalculation(aircraftType, emissions) {
    this.trackEvent('Emissions Calculated', 'Environmental', aircraftType, Math.round(emissions))
  }

  trackSearch(searchTerm, resultCount) {
    this.trackEvent('Search', 'User Interaction', searchTerm, resultCount)
  }

  trackExport(exportType, dataSize) {
    this.trackEvent('Data Export', 'User Action', exportType, dataSize)
  }

  // E-commerce tracking for ad revenue
  trackAdRevenue(adUnit, revenue, currency = 'USD') {
    if (!this.isInitialized || !this.consentGiven) return

    ReactGA.gtag('event', 'purchase', {
      transaction_id: `ad-${Date.now()}`,
      value: revenue,
      currency: currency,
      items: [{
        item_id: adUnit,
        item_name: 'Advertisement View',
        category: 'Ad Revenue',
        quantity: 1,
        price: revenue
      }]
    })
  }

  // User engagement tracking
  trackTimeOnPage(startTime) {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    this.trackEvent('Time on Page', 'Engagement', window.location.pathname, timeSpent)
  }

  trackScrollDepth(percentage) {
    this.trackEvent('Scroll Depth', 'Engagement', `${percentage}%`, percentage)
  }

  // Error tracking
  trackError(error, errorInfo = null) {
    this.trackEvent('JavaScript Error', 'Error', error.message || error.toString())
  }

  // Performance tracking
  trackPerformance(metric, value) {
    this.trackEvent('Performance', 'Technical', metric, Math.round(value))
  }

  // Custom dimensions for aviation data
  setCustomDimensions(dimensions) {
    if (!this.isInitialized || !this.consentGiven) return

    ReactGA.gtag('config', this.trackingId, {
      custom_map: dimensions
    })
  }

  // Get analytics data (requires Google Analytics Reporting API)
  async getAnalyticsData(startDate, endDate, metrics = ['sessions', 'pageviews', 'users']) {
    // This would require server-side implementation with Google Analytics Reporting API
    // For now, we'll return a placeholder
    console.log('Analytics data request:', { startDate, endDate, metrics })
    return {
      sessions: 0,
      pageviews: 0,
      users: 0,
      note: 'Implement server-side Google Analytics Reporting API for real data'
    }
  }
}

// Create singleton instance
const analytics = new AnalyticsManager()

// Auto-initialize if consent already given
if (analytics.checkConsent()) {
  analytics.initialize()
}

export default analytics

// Convenience functions for easy use throughout the app
export const trackPageView = (path) => analytics.trackPageView(path)
export const trackEvent = (action, category, label, value) => analytics.trackEvent(action, category, label, value)
export const trackFlightInteraction = (action, flightData) => analytics.trackFlightInteraction(action, flightData)
export const trackMapInteraction = (action, details) => analytics.trackMapInteraction(action, details)
export const trackAdInteraction = (action, adType, company) => analytics.trackAdInteraction(action, adType, company)
export const grantAnalyticsConsent = () => analytics.grantConsent()
export const denyAnalyticsConsent = () => analytics.denyConsent()
