import { createContext, useContext, useState, useEffect } from 'react'

const AdDemoContext = createContext()

export const useAdDemo = () => {
  const context = useContext(AdDemoContext)
  if (!context) {
    throw new Error('useAdDemo must be used within an AdDemoProvider')
  }
  return context
}

export const AdDemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(null)
  const [demoAds] = useState([])
  const [demoMetrics, setDemoMetrics] = useState({})
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  // Demo ad templates for different companies
  const [adTemplates] = useState([
    {
      id: 'boeing-demo',
      company: 'Boeing',
      industry: 'Aerospace Manufacturing',
      ads: {
        banner: {
          image: '/demo-ads/boeing-banner.jpg',
          text: 'Boeing 787 Dreamliner - The Future of Flight',
          cta: 'Learn More',
          link: 'https://boeing.com',
          size: '728x90'
        },
        sidebar: {
          image: '/demo-ads/boeing-sidebar.jpg',
          text: 'Sustainable Aviation Solutions',
          cta: 'Discover Innovation',
          link: 'https://boeing.com',
          size: '300x250'
        },
        video: {
          image: '/demo-ads/boeing-video-thumb.jpg',
          title: 'Boeing Sustainability Initiative',
          duration: '30s',
          description: 'See how Boeing is leading sustainable aviation',
          link: 'https://boeing.com/sustainability',
          type: 'video'
        },
        sponsored: {
          title: 'Sponsored: Boeing\'s Carbon Neutral Goals',
          content: 'Learn how Boeing is working towards carbon neutral flight by 2050',
          image: '/demo-ads/boeing-sponsored.jpg'
        }
      },
      metrics: {
        impressions: 125000,
        clicks: 3750,
        ctr: 3.0,
        conversions: 187,
        cost: 2500,
        roi: 340
      }
    },
    {
      id: 'airbus-demo',
      company: 'Airbus',
      industry: 'Aerospace Manufacturing',
      ads: {
        banner: {
          image: '/demo-ads/airbus-banner.jpg',
          text: 'Airbus A350 - Efficiency Redefined',
          cta: 'Explore Now',
          link: 'https://airbus.com',
          size: '728x90'
        },
        sidebar: {
          image: '/demo-ads/airbus-sidebar.jpg',
          text: 'Zero Emission Flight',
          cta: 'Join the Future',
          link: 'https://airbus.com',
          size: '300x250'
        },
        video: {
          image: '/demo-ads/airbus-video-thumb.jpg',
          title: 'Airbus Hydrogen Aircraft',
          duration: '45s',
          description: 'The future of zero-emission commercial aviation',
          link: 'https://airbus.com/hydrogen',
          type: 'video'
        },
        sponsored: {
          title: 'Sponsored: Airbus ZEROe Initiative',
          content: 'Discover Airbus\'s hydrogen-powered aircraft development program',
          image: '/demo-ads/airbus-sponsored.jpg'
        }
      },
      metrics: {
        impressions: 98000,
        clicks: 2940,
        ctr: 3.0,
        conversions: 147,
        cost: 2000,
        roi: 285
      }
    },
    {
      id: 'shell-demo',
      company: 'Shell Aviation',
      industry: 'Sustainable Aviation Fuel',
      ads: {
        banner: {
          image: '/demo-ads/shell-banner.jpg',
          text: 'Shell SAF - Sustainable Aviation Fuel',
          cta: 'Reduce Emissions',
          link: 'https://shell.com/aviation',
          size: '728x90'
        },
        sidebar: {
          image: '/demo-ads/shell-sidebar.jpg',
          text: 'Power Cleaner Flights',
          cta: 'Learn About SAF',
          link: 'https://shell.com/aviation',
          size: '300x250'
        },
        video: {
          image: '/demo-ads/shell-video-thumb.jpg',
          title: 'Shell Sustainable Aviation Fuel',
          duration: '60s',
          description: 'How SAF reduces aviation emissions by up to 80%',
          link: 'https://shell.com/aviation/sustainable-aviation-fuel',
          type: 'video'
        },
        sponsored: {
          title: 'Sponsored: Shell\'s SAF Solutions',
          content: 'Sustainable Aviation Fuel that can reduce lifecycle emissions by up to 80%',
          image: '/demo-ads/shell-sponsored.jpg'
        }
      },
      metrics: {
        impressions: 87500,
        clicks: 2625,
        ctr: 3.0,
        conversions: 131,
        cost: 1750,
        roi: 298
      }
    },
    {
      id: 'rolls-royce-demo',
      company: 'Rolls-Royce',
      industry: 'Aircraft Engines',
      ads: {
        banner: {
          image: '/demo-ads/rr-banner.jpg',
          text: 'Rolls-Royce UltraFan - Next Generation Efficiency',
          cta: 'Discover More',
          link: 'https://rolls-royce.com',
          size: '728x90'
        },
        sidebar: {
          image: '/demo-ads/rr-sidebar.jpg',
          text: 'Cleaner Engine Technology',
          cta: 'Innovation Hub',
          link: 'https://rolls-royce.com',
          size: '300x250'
        },
        video: {
          image: '/demo-ads/rr-video-thumb.jpg',
          title: 'UltraFan Engine Technology',
          duration: '40s',
          description: 'The world\'s most efficient large aero engine',
          link: 'https://rolls-royce.com/innovation/ultrafan',
          type: 'video'
        },
        sponsored: {
          title: 'Sponsored: Rolls-Royce Net Zero',
          content: 'Leading the transition to net zero aviation with revolutionary engine technology',
          image: '/demo-ads/rr-sponsored.jpg'
        }
      },
      metrics: {
        impressions: 76000,
        clicks: 2280,
        ctr: 3.0,
        conversions: 114,
        cost: 1500,
        roi: 312
      }
    }
  ])

  // Load demo state from localStorage
  useEffect(() => {
    const savedDemoMode = localStorage.getItem('adDemoMode')
    const savedCurrentDemo = localStorage.getItem('currentAdDemo')
    const savedAuth = sessionStorage.getItem('adDemoAuth')
    
    if (savedDemoMode === 'true') {
      setIsDemoMode(true)
    }
    
    if (savedCurrentDemo) {
      try {
        setCurrentDemo(JSON.parse(savedCurrentDemo))
      } catch (error) {
        console.error('Error parsing saved demo:', error)
      }
    }
    
    if (savedAuth === 'authenticated') {
      setIsAdminAuthenticated(true)
    }
  }, [])

  // Admin authentication
  const authenticateAdmin = (password) => {
    // Simple password check - in production, use proper authentication
    const correctPassword = 'shishirgrg'
    if (password === correctPassword) {
      setIsAdminAuthenticated(true)
      setAdminPassword('')
      sessionStorage.setItem('adDemoAuth', 'authenticated')
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false)
    setIsDemoMode(false)
    setCurrentDemo(null)
    sessionStorage.removeItem('adDemoAuth')
    localStorage.removeItem('adDemoMode')
    localStorage.removeItem('currentAdDemo')
  }

  // Demo mode controls
  const enableDemoMode = (companyId = null) => {
    if (!isAdminAuthenticated) return false
    
    setIsDemoMode(true)
    localStorage.setItem('adDemoMode', 'true')
    
    if (companyId) {
      const company = adTemplates.find(t => t.id === companyId)
      if (company) {
        setCurrentDemo(company)
        localStorage.setItem('currentAdDemo', JSON.stringify(company))
        generateDemoMetrics(company.id)
      }
    }
    
    return true
  }

  const disableDemoMode = () => {
    setIsDemoMode(false)
    setCurrentDemo(null)
    localStorage.removeItem('adDemoMode')
    localStorage.removeItem('currentAdDemo')
  }

  const switchDemoCompany = (companyId) => {
    if (!isAdminAuthenticated || !isDemoMode) return false

    // Check pre-built templates first
    const company = adTemplates.find(t => t.id === companyId)
    if (company) {
      setCurrentDemo(company)
      localStorage.setItem('currentAdDemo', JSON.stringify(company))
      generateDemoMetrics(company.id)
      return true
    }

    // Check custom uploaded companies
    const customAds = JSON.parse(localStorage.getItem('customDemoAds') || '[]')
    const customCompanies = [...new Set(customAds.map(ad => ad.company))]

    if (customCompanies.includes(companyId)) {
      const customCompany = {
        id: `custom-${companyId.toLowerCase().replace(/\s+/g, '-')}`,
        company: companyId,
        industry: 'Custom Demo Company',
        ads: {}, // Will be populated by getDemoAd function
        metrics: {
          impressions: 15000,
          clicks: 450,
          conversions: 23,
          ctr: '3.00'
        }
      }
      setCurrentDemo(customCompany)
      localStorage.setItem('currentAdDemo', JSON.stringify(customCompany))
      generateDemoMetrics(customCompany.id)
      return true
    }

    return false
  }

  // Generate realistic demo metrics
  const generateDemoMetrics = (companyId) => {
    const baseMetrics = adTemplates.find(t => t.id === companyId)?.metrics || {}
    
    // Add some realistic variation
    const variation = () => (Math.random() - 0.5) * 0.1 // ±5% variation
    
    const metrics = {
      ...baseMetrics,
      impressions: Math.floor(baseMetrics.impressions * (1 + variation())),
      clicks: Math.floor(baseMetrics.clicks * (1 + variation())),
      conversions: Math.floor(baseMetrics.conversions * (1 + variation())),
      lastUpdated: new Date().toISOString(),
      timeRange: '30 days',
      demographics: {
        aviation_professionals: 45,
        environmental_researchers: 25,
        policy_makers: 15,
        students: 10,
        general_public: 5
      },
      geographic: {
        north_america: 40,
        europe: 35,
        asia_pacific: 20,
        other: 5
      },
      devices: {
        desktop: 65,
        mobile: 30,
        tablet: 5
      }
    }
    
    // Recalculate CTR
    metrics.ctr = ((metrics.clicks / metrics.impressions) * 100).toFixed(2)
    
    setDemoMetrics(prev => ({
      ...prev,
      [companyId]: metrics
    }))
  }

  // Get current ad for specific placement
  const getDemoAd = (placement) => {
    if (!isDemoMode || !currentDemo) {
      console.log('getDemoAd: No demo mode or current demo', { isDemoMode, currentDemo })
      return null
    }

    // First check if there's a custom uploaded ad for this company and placement
    const customAds = JSON.parse(localStorage.getItem('customDemoAds') || '[]')
    console.log('getDemoAd: Custom ads from localStorage:', customAds)
    console.log('getDemoAd: Looking for placement:', placement, 'company:', currentDemo.company)

    // Map placement names to upload types
    const placementMap = {
      'banner': 'banner',
      'sidebar': 'sidebar',
      'video': 'video',
      'sponsored': 'sponsored'
    }

    const customAd = customAds.find(ad =>
      ad.company.toLowerCase() === currentDemo.company.toLowerCase() &&
      ad.type === placementMap[placement]
    )

    console.log('getDemoAd: Found custom ad:', customAd)

    if (customAd) {
      // Convert custom ad format to demo ad format
      const adData = {
        image: customAd.fileUrl,
        text: customAd.adHeadline || `${customAd.company} - Professional Solutions`,
        description: customAd.adDescription || 'Discover innovative solutions for your business',
        cta: customAd.ctaText || 'Learn More',
        link: customAd.targetUrl || 'https://example.com', // Use uploaded target URL
        size: placement === 'banner' ? '728x90' : placement === 'sidebar' ? '300x250' : 'video',
        type: customAd.fileType?.startsWith('video/') ? 'video' : 'image',
        title: customAd.adHeadline || `${customAd.company} Video`,
        content: customAd.adDescription || 'Learn more about our innovative solutions'
      }
      console.log('getDemoAd: Returning custom ad data:', adData)
      return adData
    }

    // Fall back to pre-built demo ads
    const fallbackAd = currentDemo.ads[placement] || null
    console.log('getDemoAd: Returning fallback ad:', fallbackAd)
    return fallbackAd
  }

  // Get current metrics
  const getCurrentMetrics = () => {
    if (!currentDemo) return null
    return demoMetrics[currentDemo.id] || currentDemo.metrics
  }

  // Get all available companies (pre-built + custom)
  const getAllCompanies = () => {
    const customAds = JSON.parse(localStorage.getItem('customDemoAds') || '[]')
    const customCompanies = [...new Set(customAds.map(ad => ad.company))]

    const customTemplates = customCompanies.map(companyName => ({
      id: companyName, // Use company name as ID for custom companies
      company: companyName,
      industry: 'Custom Demo Company',
      isCustom: true
    }))

    return [...adTemplates, ...customTemplates]
  }

  // Upload custom demo content (for admin)
  const uploadDemoContent = (companyName, adType, content) => {
    if (!isAdminAuthenticated) return false

    // In a real implementation, this would upload to a server
    // For now, we'll store in localStorage
    const customAds = JSON.parse(localStorage.getItem('customDemoAds') || '[]')

    const newAd = {
      id: `custom-${Date.now()}`,
      company: companyName,
      type: adType,
      content: content,
      uploaded: new Date().toISOString()
    }

    customAds.push(newAd)
    localStorage.setItem('customDemoAds', JSON.stringify(customAds))

    return true
  }

  const value = {
    // Demo state
    isDemoMode,
    currentDemo,
    isAdminAuthenticated,
    adTemplates,

    // Authentication
    authenticateAdmin,
    logoutAdmin,
    adminPassword,
    setAdminPassword,

    // Demo controls
    enableDemoMode,
    disableDemoMode,
    switchDemoCompany,
    getAllCompanies,

    // Content access
    getDemoAd,
    getCurrentMetrics,
    uploadDemoContent,
    

    // Metrics
    demoMetrics,
    generateDemoMetrics
  }

  return (
    <AdDemoContext.Provider value={value}>
      {children}
    </AdDemoContext.Provider>
  )
}
