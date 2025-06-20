// Google AdSense Integration Component
// Automatic ad serving and revenue optimization

import React, { useEffect, useState } from 'react'
import analytics from '../../utils/analytics'

class AdSenseManager {
  constructor() {
    this.publisherId = import.meta.env.VITE_GOOGLE_ADSENSE_PUBLISHER_ID
    this.isLoaded = false
    this.adUnits = new Map()
    this.revenue = 0
  }

  // Initialize Google AdSense
  async initialize() {
    if (!this.publisherId) {
      console.warn('Google AdSense Publisher ID not found. Please set VITE_GOOGLE_ADSENSE_PUBLISHER_ID in your .env file')
      return false
    }

    try {
      // Load AdSense script
      await this.loadAdSenseScript()
      
      // Initialize AdSense
      if (window.adsbygoogle) {
        console.log('✅ Google AdSense initialized successfully')
        this.isLoaded = true
        return true
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google AdSense:', error)
      return false
    }
  }

  // Load AdSense script dynamically
  loadAdSenseScript() {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src*="adsbygoogle.js"]`)) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.publisherId}`
      script.async = true
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        console.log('📄 AdSense script loaded')
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load AdSense script'))
      }

      document.head.appendChild(script)
    })
  }

  // Create and display ad unit
  displayAd(adUnitId, adSlot, adFormat = 'auto', adLayout = null) {
    if (!this.isLoaded) {
      console.warn('AdSense not loaded yet')
      return false
    }

    try {
      const adElement = document.querySelector(`[data-ad-slot="${adSlot}"]`)
      if (!adElement) {
        console.error(`Ad element with slot ${adSlot} not found`)
        return false
      }

      // Push ad to AdSense
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
        
        // Track ad impression
        analytics.trackAdInteraction('AdSense Impression', adFormat, adSlot)
        
        // Store ad unit info
        this.adUnits.set(adSlot, {
          id: adUnitId,
          slot: adSlot,
          format: adFormat,
          layout: adLayout,
          displayTime: new Date()
        })

        console.log(`📺 AdSense ad displayed: ${adSlot}`)
        return true
      }
    } catch (error) {
      console.error('Error displaying AdSense ad:', error)
      return false
    }
  }

  // Track ad revenue (estimated)
  trackAdRevenue(adSlot, estimatedRevenue) {
    analytics.trackAdRevenue(adSlot, estimatedRevenue)
    this.revenue += estimatedRevenue
  }

  // Get ad performance data
  getAdPerformance() {
    return {
      totalAds: this.adUnits.size,
      totalRevenue: this.revenue,
      adUnits: Array.from(this.adUnits.values())
    }
  }
}

// Create singleton instance
const adSenseManager = new AdSenseManager()

// Auto-initialize
adSenseManager.initialize()

// AdSense Ad Component
const AdSenseAd = ({ 
  adSlot, 
  adFormat = 'auto', 
  adLayout = null,
  style = {},
  className = '',
  responsive = true 
}) => {
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(null)

  useEffect(() => {
    const displayAd = async () => {
      try {
        // Wait for AdSense to be ready
        let attempts = 0
        while (!adSenseManager.isLoaded && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }

        if (adSenseManager.isLoaded) {
          const success = adSenseManager.displayAd(
            `adsense-${adSlot}`,
            adSlot,
            adFormat,
            adLayout
          )
          setAdLoaded(success)
        } else {
          setAdError('AdSense failed to load')
        }
      } catch (error) {
        setAdError(error.message)
        console.error('Error loading AdSense ad:', error)
      }
    }

    displayAd()
  }, [adSlot, adFormat, adLayout])

  // Handle ad click tracking
  const handleAdClick = () => {
    analytics.trackAdInteraction('AdSense Click', adFormat, adSlot)
    
    // Estimate revenue (typical CPM rates)
    const estimatedRevenue = adFormat === 'banner' ? 0.50 : 
                           adFormat === 'sidebar' ? 0.75 : 1.00
    adSenseManager.trackAdRevenue(adSlot, estimatedRevenue)
  }

  if (adError) {
    return (
      <div className={`ad-error ${className}`} style={style}>
        <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm text-gray-500">Ad could not be loaded</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adSenseManager.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive={responsive}
        onClick={handleAdClick}
      />
      {!adLoaded && (
        <div className="ad-loading text-center p-4 bg-gray-50 dark:bg-gray-900 rounded">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Predefined ad components for common placements
export const BannerAd = ({ adSlot, className = '', style = {} }) => (
  <AdSenseAd
    adSlot={adSlot}
    adFormat="banner"
    className={`banner-ad ${className}`}
    style={{ minHeight: '90px', ...style }}
  />
)

export const SidebarAd = ({ adSlot, className = '', style = {} }) => (
  <AdSenseAd
    adSlot={adSlot}
    adFormat="rectangle"
    className={`sidebar-ad ${className}`}
    style={{ minHeight: '250px', width: '300px', ...style }}
  />
)

export const InArticleAd = ({ adSlot, className = '', style = {} }) => (
  <AdSenseAd
    adSlot={adSlot}
    adFormat="fluid"
    adLayout="in-article"
    className={`in-article-ad ${className}`}
    style={style}
  />
)

export const ResponsiveAd = ({ adSlot, className = '', style = {} }) => (
  <AdSenseAd
    adSlot={adSlot}
    adFormat="auto"
    className={`responsive-ad ${className}`}
    style={style}
  />
)

// AdSense Performance Component
export const AdSensePerformance = () => {
  const [performance, setPerformance] = useState(null)

  useEffect(() => {
    const updatePerformance = () => {
      setPerformance(adSenseManager.getAdPerformance())
    }

    updatePerformance()
    const interval = setInterval(updatePerformance, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (!performance) return null

  return (
    <div className="adsense-performance bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-3">AdSense Performance</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{performance.totalAds}</div>
          <div className="text-sm text-gray-500">Active Ads</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">${performance.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-500">Est. Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${(performance.totalRevenue / Math.max(performance.totalAds, 1)).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Avg. per Ad</div>
        </div>
      </div>
    </div>
  )
}

export default AdSenseAd
export { adSenseManager }
