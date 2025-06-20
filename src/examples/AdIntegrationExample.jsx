import React, { useEffect, useState } from 'react'
import { 
  TopBannerAd, 
  SidebarAd, 
  InContentAd, 
  StickyBottomAd,
  MobileAd,
  ConsentBanner,
  AdPerformanceMonitor 
} from '../components/AdContainer'
import adManager from '../services/adManager'

/**
 * Example: How to integrate ads safely into your Aviation Emissions website
 * This example shows best practices for ad placement without affecting core functionality
 */

const AdIntegrationExample = () => {
  const [adsEnabled, setAdsEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle ad loading success
  const handleAdLoad = (slotId) => {
    console.log(`✅ Ad loaded successfully: ${slotId}`)
  }

  // Handle ad loading errors
  const handleAdError = (slotId, error) => {
    console.error(`❌ Ad failed to load: ${slotId}`, error)
  }

  // Toggle ads (useful for premium users)
  const toggleAds = () => {
    if (adsEnabled) {
      adManager.removeAds()
    } else {
      window.location.reload() // Simple way to re-enable ads
    }
    setAdsEnabled(!adsEnabled)
  }

  return (
    <div className="aviation-app">
      {/* Consent Banner - Shows first time only */}
      <ConsentBanner />

      {/* Top Banner Ad - Non-intrusive header placement */}
      {adsEnabled && (
        <TopBannerAd
          slotId="top-banner-ad"
          onLoad={handleAdLoad}
          onError={handleAdError}
          className="aviation-theme"
        />
      )}

      {/* Main Content Area */}
      <div className="main-content" style={{ display: 'flex', gap: '20px' }}>
        
        {/* Primary Content */}
        <main style={{ flex: 1 }}>
          <h1>🛩️ Aviation Emissions Dashboard</h1>
          
          {/* Your existing dashboard content */}
          <div className="dashboard-content">
            <p>Your flight tracking and emissions data goes here...</p>
            
            {/* Mobile Ad - Only show on mobile devices */}
            {adsEnabled && isMobile && (
              <MobileAd
                slotId="mobile-content-ad"
                onLoad={handleAdLoad}
                onError={handleAdError}
                style={{ margin: '20px 0' }}
              />
            )}
            
            <div className="flight-stats">
              <h2>📊 Live Flight Statistics</h2>
              <p>Real-time aviation data and analytics...</p>
            </div>

            {/* In-Content Ad - Appears after main content */}
            {adsEnabled && !isMobile && (
              <InContentAd
                slotId="content-square-ad"
                onLoad={handleAdLoad}
                onError={handleAdError}
                lazy={true}
                refreshInterval={300000} // Refresh every 5 minutes
              />
            )}

            <div className="emissions-data">
              <h2>🌍 Carbon Emissions Analysis</h2>
              <p>Environmental impact calculations...</p>
            </div>
          </div>
        </main>

        {/* Sidebar - Desktop only */}
        {!isMobile && (
          <aside style={{ width: '320px' }}>
            <div className="sidebar-content">
              <h3>📈 Quick Stats</h3>
              <p>Sidebar content goes here...</p>
              
              {/* Sidebar Ad - Sticky positioning */}
              {adsEnabled && (
                <SidebarAd
                  slotId="sidebar-ad"
                  onLoad={handleAdLoad}
                  onError={handleAdError}
                  lazy={true}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Sticky Bottom Ad - Can be dismissed */}
      {adsEnabled && (
        <StickyBottomAd
          slotId="sticky-bottom-ad"
          onLoad={handleAdLoad}
          onError={handleAdError}
        />
      )}

      {/* Ad Controls (for testing/admin) */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '20px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        <button onClick={toggleAds} style={{ 
          background: adsEnabled ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          {adsEnabled ? '🚫 Disable Ads' : '✅ Enable Ads'}
        </button>
      </div>

      {/* Performance Monitor - Development only */}
      {process.env.NODE_ENV === 'development' && <AdPerformanceMonitor />}
    </div>
  )
}

export default AdIntegrationExample

/**
 * INTEGRATION INSTRUCTIONS:
 * 
 * 1. Import the CSS file in your main App.jsx:
 *    import './styles/ads.css'
 * 
 * 2. Add ads to your existing components:
 *    import { TopBannerAd, SidebarAd } from './components/AdContainer'
 * 
 * 3. Place ads strategically:
 *    - Top banner: After header, before main content
 *    - Sidebar: In sidebar or right column
 *    - In-content: Between content sections
 *    - Sticky bottom: At bottom of page (dismissible)
 * 
 * 4. Configure your ad network:
 *    - Replace 'ca-pub-YOUR_PUBLISHER_ID' with your actual Google AdSense ID
 *    - Add your ad slot IDs in the adManager.js file
 * 
 * 5. Test thoroughly:
 *    - Check mobile responsiveness
 *    - Verify ads don't break your layout
 *    - Test with ad blockers enabled
 *    - Monitor performance impact
 * 
 * RECOMMENDED AD SIZES:
 * 
 * Desktop:
 * - Top Banner: 728x90 (Leaderboard)
 * - Sidebar: 300x250 (Medium Rectangle)
 * - In-Content: 300x300 (Square)
 * 
 * Mobile:
 * - Banner: 320x50 (Mobile Banner)
 * - In-Content: 300x250 (Medium Rectangle)
 * 
 * PERFORMANCE TIPS:
 * 
 * 1. Use lazy loading for below-the-fold ads
 * 2. Set reasonable refresh intervals (5+ minutes)
 * 3. Monitor Core Web Vitals impact
 * 4. Implement proper error handling
 * 5. Provide fallback content for ad failures
 * 
 * GDPR COMPLIANCE:
 * 
 * 1. Show consent banner before loading ads
 * 2. Respect user's privacy choices
 * 3. Store consent in localStorage
 * 4. Allow users to change preferences
 * 
 * TESTING CHECKLIST:
 * 
 * ✅ Ads load without blocking page render
 * ✅ Layout remains stable if ads fail
 * ✅ Mobile responsiveness works correctly
 * ✅ Consent system functions properly
 * ✅ Performance impact is minimal
 * ✅ Accessibility standards are met
 * ✅ Ad blockers don't break the site
 */
