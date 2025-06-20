/**
 * Ad Configuration for Aviation Emissions Website
 * Configure your ad networks and settings here
 */

// Ad Network Configuration
export const AD_NETWORKS = {
  google: {
    name: 'Google AdSense',
    scriptUrl: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    publisherId: 'ca-pub-YOUR_PUBLISHER_ID', // Replace with your actual ID
    crossOrigin: 'anonymous',
    async: true,
    defer: true
  },
  
  medianet: {
    name: 'Media.net',
    scriptUrl: 'https://contextual.media.net/dmedianet.js',
    publisherId: 'YOUR_MEDIA_NET_ID', // Replace with your actual ID
    async: true,
    defer: true
  },
  
  // Add more networks as needed
  amazon: {
    name: 'Amazon Publisher Services',
    scriptUrl: 'https://c.amazon-adsystem.com/aax2/apstag.js',
    async: true,
    defer: true
  }
}

// Ad Slot Configuration
export const AD_SLOTS = {
  'top-banner': {
    network: 'google',
    slotId: 'YOUR_TOP_BANNER_SLOT_ID', // Replace with actual slot ID
    sizes: {
      desktop: [728, 90],
      tablet: [468, 60],
      mobile: [320, 50]
    },
    position: 'top',
    lazy: false, // Load immediately for above-the-fold
    refreshInterval: null
  },
  
  'sidebar-rectangle': {
    network: 'google',
    slotId: 'YOUR_SIDEBAR_SLOT_ID',
    sizes: {
      desktop: [300, 250],
      tablet: [300, 250],
      mobile: [300, 250]
    },
    position: 'sidebar',
    lazy: true,
    refreshInterval: 300000 // 5 minutes
  },
  
  'in-content-square': {
    network: 'google',
    slotId: 'YOUR_CONTENT_SLOT_ID',
    sizes: {
      desktop: [300, 300],
      tablet: [300, 250],
      mobile: [300, 250]
    },
    position: 'content',
    lazy: true,
    refreshInterval: 600000 // 10 minutes
  },
  
  'mobile-banner': {
    network: 'google',
    slotId: 'YOUR_MOBILE_SLOT_ID',
    sizes: {
      mobile: [320, 50]
    },
    position: 'mobile',
    lazy: true,
    refreshInterval: null
  },
  
  'sticky-bottom': {
    network: 'google',
    slotId: 'YOUR_STICKY_SLOT_ID',
    sizes: {
      desktop: [728, 90],
      tablet: [468, 60],
      mobile: [320, 50]
    },
    position: 'bottom',
    lazy: false,
    refreshInterval: null
  }
}

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // Maximum time to wait for ad to load (milliseconds)
  loadTimeout: 10000,
  
  // Maximum number of retry attempts
  maxRetries: 3,
  
  // Retry delay multiplier (exponential backoff)
  retryDelay: 2000,
  
  // Lazy loading margin (pixels before viewport)
  lazyLoadMargin: 100,
  
  // Performance monitoring
  enablePerformanceMonitoring: true,
  
  // Console logging level
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
}

// GDPR/Privacy Configuration
export const PRIVACY_CONFIG = {
  // Show consent banner
  showConsentBanner: true,
  
  // Consent storage key
  consentStorageKey: 'aviation-ad-consent',
  
  // Consent expiry (days)
  consentExpiryDays: 365,
  
  // Default consent state (null = ask user, true = granted, false = denied)
  defaultConsent: null,
  
  // Privacy policy URL
  privacyPolicyUrl: '/privacy-policy',
  
  // Cookie policy URL
  cookiePolicyUrl: '/cookie-policy'
}

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
}

// Ad Placement Rules
export const PLACEMENT_RULES = {
  // Minimum distance between ads (pixels)
  minAdDistance: 600,
  
  // Maximum ads per page
  maxAdsPerPage: 5,
  
  // Minimum content length before showing in-content ads (words)
  minContentLength: 300,
  
  // Ad-to-content ratio (maximum percentage of page that can be ads)
  maxAdRatio: 0.3
}

// Fallback Content Templates
export const FALLBACK_TEMPLATES = {
  default: `
    <div class="ad-placeholder">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
        <span>Advertisement</span>
      </div>
    </div>
  `,
  
  aviation: `
    <div class="ad-placeholder aviation-theme">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(255,255,255,0.8);">
        <span>✈️ Support Our Aviation Research</span>
      </div>
    </div>
  `,
  
  loading: `
    <div class="ad-placeholder">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
        <div style="margin-right: 8px; width: 16px; height: 16px; border: 2px solid #ddd; border-top: 2px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <span>Loading Advertisement...</span>
      </div>
    </div>
  `,
  
  error: `
    <div class="ad-placeholder">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #dc3545;">
        <span style="margin-bottom: 8px;">Advertisement Unavailable</span>
        <button onclick="window.location.reload()" style="padding: 4px 8px; font-size: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Retry
        </button>
      </div>
    </div>
  `
}

// A/B Testing Configuration
export const AB_TESTING = {
  enabled: false,
  
  tests: {
    'ad-position-test': {
      variants: ['top', 'sidebar', 'bottom'],
      traffic: 0.1, // 10% of users
      metric: 'ctr' // click-through rate
    },
    
    'ad-size-test': {
      variants: ['small', 'medium', 'large'],
      traffic: 0.05, // 5% of users
      metric: 'viewability'
    }
  }
}

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Track ad performance
  trackPerformance: true,
  
  // Track user interactions
  trackInteractions: true,
  
  // Send data to analytics service
  analyticsEndpoint: '/api/ad-analytics',
  
  // Batch size for analytics events
  batchSize: 10,
  
  // Send interval (milliseconds)
  sendInterval: 30000
}

// Development/Testing Configuration
export const DEV_CONFIG = {
  // Show debug information
  showDebugInfo: process.env.NODE_ENV === 'development',
  
  // Use test ads
  useTestAds: process.env.NODE_ENV === 'development',
  
  // Mock ad responses
  mockAds: false,
  
  // Performance monitoring in dev
  enableDevPerformanceMonitoring: true
}

// Export default configuration
export default {
  networks: AD_NETWORKS,
  slots: AD_SLOTS,
  performance: PERFORMANCE_CONFIG,
  privacy: PRIVACY_CONFIG,
  breakpoints: BREAKPOINTS,
  placement: PLACEMENT_RULES,
  fallbacks: FALLBACK_TEMPLATES,
  abTesting: AB_TESTING,
  analytics: ANALYTICS_CONFIG,
  development: DEV_CONFIG
}

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Replace placeholder IDs:
 *    - Update 'YOUR_PUBLISHER_ID' with your Google AdSense publisher ID
 *    - Update slot IDs with your actual ad unit IDs
 * 
 * 2. Configure ad networks:
 *    - Add your Media.net or other network credentials
 *    - Set up proper ad sizes for your layout
 * 
 * 3. Customize settings:
 *    - Adjust performance thresholds
 *    - Set appropriate refresh intervals
 *    - Configure privacy settings for your region
 * 
 * 4. Test configuration:
 *    - Use development mode for testing
 *    - Enable debug information
 *    - Monitor performance metrics
 * 
 * IMPORTANT NOTES:
 * 
 * - Never commit real publisher IDs to public repositories
 * - Use environment variables for sensitive data
 * - Test thoroughly before deploying to production
 * - Monitor ad performance and user experience
 * - Comply with local privacy regulations (GDPR, CCPA, etc.)
 */
