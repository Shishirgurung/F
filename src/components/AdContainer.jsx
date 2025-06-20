import React, { useEffect, useRef, useState } from 'react'
import adManager from '../services/adManager'
import '../styles/ads.css'

const AdContainer = ({ 
  slotId, 
  size = 'banner', 
  position = 'top',
  network = 'google',
  lazy = true,
  fallbackContent = null,
  className = '',
  style = {},
  onLoad = null,
  onError = null,
  refreshInterval = null
}) => {
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Ad size configurations
  const adSizes = {
    'banner': { width: '100%', height: '90px', maxWidth: '728px', class: 'ad-banner-top' },
    'mobile-banner': { width: '100%', height: '50px', maxWidth: '320px', class: 'ad-mobile-banner' },
    'sidebar': { width: '300px', height: '250px', class: 'ad-sidebar' },
    'square': { width: '300px', height: '300px', class: 'ad-square' },
    'sticky-bottom': { width: '100%', height: '60px', class: 'ad-sticky-bottom' },
    'custom': { width: style.width || '300px', height: style.height || '250px', class: '' }
  }

  const sizeConfig = adSizes[size] || adSizes['banner']

  useEffect(() => {
    const initializeAd = async () => {
      try {
        // Initialize ad manager if not already done
        await adManager.initialize()

        // Register the ad slot
        adManager.registerAdSlot(slotId, {
          sizes: getSizesForNetwork(size),
          position,
          lazy,
          refreshInterval,
          fallbackContent: fallbackContent || `<div class="ad-placeholder">Advertisement</div>`
        })

        // If lazy loading is disabled, load immediately
        if (!lazy) {
          loadAd()
        } else {
          // Set up lazy loading observer
          adManager.observeAdSlot(slotId)
        }

      } catch (error) {
        console.error('Failed to initialize ad:', error)
        handleError(error)
      }
    }

    initializeAd()

    // Set up refresh interval if specified
    let refreshTimer
    if (refreshInterval && refreshInterval > 0) {
      refreshTimer = setInterval(() => {
        if (isVisible && !hasError) {
          refreshAd()
        }
      }, refreshInterval)
    }

    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer)
      }
    }
  }, [slotId, size, position, network, lazy, refreshInterval])

  // Load the ad
  const loadAd = async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      const success = await adManager.loadAd(slotId, network)
      
      if (success) {
        setIsLoading(false)
        setIsVisible(true)
        onLoad && onLoad(slotId)
      } else {
        throw new Error('Ad loading failed')
      }
    } catch (error) {
      handleError(error)
    }
  }

  // Refresh the ad
  const refreshAd = async () => {
    console.log(`🔄 Refreshing ad: ${slotId}`)
    await loadAd()
  }

  // Handle ad errors
  const handleError = (error) => {
    console.error(`Ad error for ${slotId}:`, error)
    setIsLoading(false)
    setHasError(true)
    onError && onError(slotId, error)
  }

  // Get sizes for different ad networks
  const getSizesForNetwork = (sizeType) => {
    const sizeMap = {
      'banner': [[728, 90], [320, 50]],
      'mobile-banner': [[320, 50], [300, 50]],
      'sidebar': [[300, 250], [250, 250]],
      'square': [[300, 300], [250, 250]],
      'sticky-bottom': [[728, 90], [320, 50]],
      'custom': [[300, 250]]
    }
    return sizeMap[sizeType] || sizeMap['banner']
  }

  // Handle sticky ad close
  const handleStickyClose = () => {
    if (containerRef.current) {
      containerRef.current.style.display = 'none'
    }
  }

  // Determine container classes
  const getContainerClasses = () => {
    const classes = [
      'ad-container',
      sizeConfig.class,
      className
    ]

    if (isLoading) classes.push('loading')
    if (hasError) classes.push('error', 'ad-fallback')
    if (isVisible && !isLoading) classes.push('loaded', 'fade-in')
    if (size === 'sticky-bottom') classes.push('no-hover')

    return classes.filter(Boolean).join(' ')
  }

  // Container styles
  const containerStyle = {
    width: sizeConfig.width,
    height: sizeConfig.height,
    maxWidth: sizeConfig.maxWidth,
    ...style
  }

  return (
    <div
      ref={containerRef}
      id={slotId}
      className={getContainerClasses()}
      style={containerStyle}
      data-ad-size={size}
      data-ad-network={network}
      role="banner"
      aria-label="Advertisement"
    >
      {/* Ad Label for Transparency */}
      <span className="ad-label">Ad</span>

      {/* Sticky Ad Close Button */}
      {size === 'sticky-bottom' && (
        <button 
          className="ad-close"
          onClick={handleStickyClose}
          aria-label="Close advertisement"
          title="Close ad"
        >
          ×
        </button>
      )}

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="ad-placeholder">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid #ddd', 
              borderTop: '2px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading Advertisement...
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="ad-placeholder">
          <div style={{ color: '#dc3545' }}>
            Advertisement Unavailable
            <br />
            <button 
              onClick={loadAd}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                fontSize: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Custom Fallback Content */}
      {!isLoading && !hasError && fallbackContent && (
        <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
      )}
    </div>
  )
}

// Predefined ad components for common use cases
export const TopBannerAd = (props) => (
  <AdContainer 
    size="banner" 
    position="top" 
    {...props} 
  />
)

export const SidebarAd = (props) => (
  <AdContainer 
    size="sidebar" 
    position="sidebar" 
    {...props} 
  />
)

export const InContentAd = (props) => (
  <AdContainer 
    size="square" 
    position="content" 
    {...props} 
  />
)

export const StickyBottomAd = (props) => (
  <AdContainer 
    size="sticky-bottom" 
    position="bottom" 
    lazy={false}
    {...props} 
  />
)

export const MobileAd = (props) => (
  <AdContainer 
    size="mobile-banner" 
    position="mobile" 
    {...props} 
  />
)

// Ad Performance Monitor Component
export const AdPerformanceMonitor = () => {
  const [metrics, setMetrics] = useState(null)
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    const updateMetrics = () => {
      const performanceData = adManager.getPerformanceMetrics()
      setMetrics(performanceData)
    }

    // Update metrics every 30 seconds
    const interval = setInterval(updateMetrics, 30000)
    updateMetrics() // Initial load

    return () => clearInterval(interval)
  }, [])

  if (!metrics || !showMetrics) {
    return (
      <button
        className="ad-performance"
        onClick={() => setShowMetrics(true)}
        style={{ display: 'block' }}
      >
        📊 Ad Stats
      </button>
    )
  }

  return (
    <div className="ad-performance show">
      <div onClick={() => setShowMetrics(false)} style={{ cursor: 'pointer' }}>
        <strong>Ad Performance</strong><br />
        Avg Load: {metrics.averageLoadTime}<br />
        Impressions: {metrics.totalImpressions}<br />
        Error Rate: {metrics.errorRate}<br />
        <small>Click to hide</small>
      </div>
    </div>
  )
}

// Consent Banner Component
export const ConsentBanner = () => {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('ad-consent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const handleConsent = async (granted) => {
    localStorage.setItem('ad-consent', granted ? 'granted' : 'denied')
    setShowConsent(false)
    
    if (granted) {
      // Initialize ads after consent
      await adManager.initialize()
    }
  }

  if (!showConsent) return null

  return (
    <div className="ad-consent-modal">
      <div className="ad-consent-content">
        <h3>🍪 Cookie & Ad Consent</h3>
        <p>
          We use cookies and display advertisements to support our free aviation emissions tracking service. 
          Your data helps us provide better insights and keep the service running.
        </p>
        <div className="ad-consent-buttons">
          <button 
            className="consent-btn accept"
            onClick={() => handleConsent(true)}
          >
            Accept All
          </button>
          <button 
            className="consent-btn decline"
            onClick={() => handleConsent(false)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdContainer
