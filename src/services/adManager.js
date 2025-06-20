/**
 * Safe Ad Manager for Aviation Emissions Website
 * Handles non-blocking ad loading with fallback strategies
 */

class AdManager {
  constructor() {
    this.adSlots = new Map()
    this.loadedNetworks = new Set()
    this.performanceMetrics = {
      loadTimes: [],
      errors: [],
      impressions: 0
    }
    this.isInitialized = false
    this.consentGiven = false
  }

  // Initialize the ad manager
  async initialize() {
    if (this.isInitialized) return
    
    try {
      // Check for consent (GDPR compliance)
      this.consentGiven = this.checkConsent()
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring()
      
      // Initialize lazy loading observer
      this.setupLazyLoading()
      
      this.isInitialized = true
      console.log('✅ Ad Manager initialized successfully')
    } catch (error) {
      console.error('❌ Ad Manager initialization failed:', error)
      this.handleError('initialization', error)
    }
  }

  // Check user consent for personalized ads
  checkConsent() {
    // Check localStorage for consent
    const consent = localStorage.getItem('ad-consent')
    return consent === 'granted'
  }

  // Request user consent
  async requestConsent() {
    return new Promise((resolve) => {
      // Create consent modal (you can customize this)
      const modal = this.createConsentModal()
      document.body.appendChild(modal)
      
      modal.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'accept') {
          localStorage.setItem('ad-consent', 'granted')
          this.consentGiven = true
          resolve(true)
        } else if (e.target.dataset.action === 'decline') {
          localStorage.setItem('ad-consent', 'denied')
          this.consentGiven = false
          resolve(false)
        }
        modal.remove()
      })
    })
  }

  // Create consent modal
  createConsentModal() {
    const modal = document.createElement('div')
    modal.className = 'ad-consent-modal'
    modal.innerHTML = `
      <div class="ad-consent-content">
        <h3>Cookie & Ad Consent</h3>
        <p>We use cookies and display ads to support our aviation emissions tracking service. 
           Your data helps us provide better insights.</p>
        <div class="ad-consent-buttons">
          <button data-action="accept" class="consent-btn accept">Accept</button>
          <button data-action="decline" class="consent-btn decline">Decline</button>
        </div>
      </div>
    `
    return modal
  }

  // Register an ad slot
  registerAdSlot(slotId, config = {}) {
    const defaultConfig = {
      sizes: [[728, 90], [320, 50]], // Desktop and mobile banner
      position: 'top',
      lazy: true,
      refreshInterval: null,
      fallbackContent: '<div class="ad-placeholder">Advertisement</div>'
    }

    const slotConfig = { ...defaultConfig, ...config }
    this.adSlots.set(slotId, {
      ...slotConfig,
      element: null,
      loaded: false,
      visible: false,
      loadAttempts: 0
    })

    console.log(`📝 Registered ad slot: ${slotId}`)
  }

  // Load ads asynchronously
  async loadAd(slotId, adNetwork = 'google') {
    const slot = this.adSlots.get(slotId)
    if (!slot) {
      console.error(`❌ Ad slot ${slotId} not found`)
      return false
    }

    const startTime = performance.now()

    try {
      // Find the ad container
      const container = document.getElementById(slotId)
      if (!container) {
        throw new Error(`Container ${slotId} not found in DOM`)
      }

      slot.element = container
      slot.loadAttempts++

      // Load ad network script if not already loaded
      await this.loadAdNetwork(adNetwork)

      // Load the specific ad
      const success = await this.loadSpecificAd(slotId, adNetwork)

      if (success) {
        slot.loaded = true
        this.performanceMetrics.impressions++
        const loadTime = performance.now() - startTime
        this.performanceMetrics.loadTimes.push(loadTime)
        console.log(`✅ Ad loaded successfully: ${slotId} (${loadTime.toFixed(2)}ms)`)
      } else {
        throw new Error('Ad loading failed')
      }

      return success
    } catch (error) {
      console.error(`❌ Failed to load ad ${slotId}:`, error)
      this.handleAdError(slotId, error)
      return false
    }
  }

  // Load ad network script
  async loadAdNetwork(network) {
    if (this.loadedNetworks.has(network)) return true

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.async = true
      script.defer = true

      script.onload = () => {
        this.loadedNetworks.add(network)
        console.log(`✅ ${network} ad network loaded`)
        resolve(true)
      }

      script.onerror = () => {
        console.error(`❌ Failed to load ${network} ad network`)
        reject(new Error(`Failed to load ${network}`))
      }

      // Set script source based on network
      switch (network) {
        case 'google':
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
          script.setAttribute('data-ad-client', 'ca-pub-YOUR_PUBLISHER_ID')
          break
        case 'media.net':
          script.src = 'https://contextual.media.net/dmedianet.js'
          break
        default:
          reject(new Error(`Unknown ad network: ${network}`))
          return
      }

      document.head.appendChild(script)
    })
  }

  // Load specific ad implementation
  async loadSpecificAd(slotId, network) {
    const slot = this.adSlots.get(slotId)
    
    try {
      switch (network) {
        case 'google':
          return await this.loadGoogleAd(slotId, slot)
        case 'media.net':
          return await this.loadMediaNetAd(slotId, slot)
        default:
          throw new Error(`Unsupported network: ${network}`)
      }
    } catch (error) {
      console.error(`❌ Error loading ${network} ad:`, error)
      return false
    }
  }

  // Google AdSense implementation
  async loadGoogleAd(slotId, slot) {
    if (!window.adsbygoogle) {
      throw new Error('Google AdSense not loaded')
    }

    const adElement = document.createElement('ins')
    adElement.className = 'adsbygoogle'
    adElement.style.display = 'block'
    adElement.setAttribute('data-ad-client', 'ca-pub-YOUR_PUBLISHER_ID')
    adElement.setAttribute('data-ad-slot', 'YOUR_AD_SLOT_ID')
    adElement.setAttribute('data-ad-format', 'auto')
    adElement.setAttribute('data-full-width-responsive', 'true')

    slot.element.appendChild(adElement)

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
      return true
    } catch (error) {
      console.error('Google Ad push failed:', error)
      return false
    }
  }

  // Handle ad loading errors
  handleAdError(slotId, error) {
    const slot = this.adSlots.get(slotId)
    if (!slot) return

    this.performanceMetrics.errors.push({
      slotId,
      error: error.message,
      timestamp: Date.now(),
      attempts: slot.loadAttempts
    })

    // Show fallback content
    if (slot.element && slot.fallbackContent) {
      slot.element.innerHTML = slot.fallbackContent
      slot.element.classList.add('ad-fallback')
    }

    // Retry logic (max 3 attempts)
    if (slot.loadAttempts < 3) {
      setTimeout(() => {
        console.log(`🔄 Retrying ad load for ${slotId} (attempt ${slot.loadAttempts + 1})`)
        this.loadAd(slotId)
      }, 2000 * slot.loadAttempts) // Exponential backoff
    }
  }

  // Setup lazy loading for ads
  setupLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, loading all ads immediately')
      return
    }

    this.lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const slotId = entry.target.id
          const slot = this.adSlots.get(slotId)
          
          if (slot && !slot.loaded && !slot.visible) {
            slot.visible = true
            this.loadAd(slotId)
            this.lazyObserver.unobserve(entry.target)
          }
        }
      })
    }, {
      rootMargin: '100px' // Load ads 100px before they come into view
    })
  }

  // Observe element for lazy loading
  observeAdSlot(slotId) {
    const element = document.getElementById(slotId)
    if (element && this.lazyObserver) {
      this.lazyObserver.observe(element)
    }
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    // Monitor page performance impact
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.name.includes('googlesyndication') || entry.name.includes('media.net')) {
            console.log(`📊 Ad network performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`)
          }
        })
      })
      observer.observe({ entryTypes: ['resource'] })
    }
  }

  // Get performance metrics
  getPerformanceMetrics() {
    const avgLoadTime = this.performanceMetrics.loadTimes.length > 0 
      ? this.performanceMetrics.loadTimes.reduce((a, b) => a + b, 0) / this.performanceMetrics.loadTimes.length 
      : 0

    return {
      averageLoadTime: avgLoadTime.toFixed(2) + 'ms',
      totalImpressions: this.performanceMetrics.impressions,
      errorRate: (this.performanceMetrics.errors.length / Math.max(this.performanceMetrics.impressions, 1) * 100).toFixed(2) + '%',
      errors: this.performanceMetrics.errors
    }
  }

  // Remove ads (useful for premium users)
  removeAds() {
    this.adSlots.forEach((slot, slotId) => {
      const element = document.getElementById(slotId)
      if (element) {
        element.style.display = 'none'
      }
    })
    console.log('🚫 All ads hidden')
  }

  // Refresh ads (for long-session users)
  refreshAds() {
    this.adSlots.forEach((slot, slotId) => {
      if (slot.loaded && slot.visible) {
        slot.loaded = false
        this.loadAd(slotId)
      }
    })
    console.log('🔄 Refreshing all visible ads')
  }
}

// Export singleton instance
export default new AdManager()
