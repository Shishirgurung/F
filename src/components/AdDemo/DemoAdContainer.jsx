import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, ExternalLink, X } from 'lucide-react'
import { useAdDemo } from '../../contexts/AdDemoContext'

const DemoAdContainer = ({
  placement,
  fallbackContent = null,
  className = '',
  style = {},
  showLabel = true
}) => {
  const { isDemoMode, getDemoAd } = useAdDemo()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const demoAd = getDemoAd(placement)

  const handleAdClick = () => {
    // Track ad click with real analytics
    trackAdClick(placement, demoAd)

    // For video ads, open modal
    if (placement === 'video') {
      setShowVideoModal(true)
      return
    }

    // For other ads, navigate to target link
    if (demoAd.link) {
      console.log(`Navigating to: ${demoAd.link}`)
      // Open link in new tab for better user experience
      window.open(demoAd.link, '_blank', 'noopener,noreferrer')
    }
  }

  // Real ad tracking functions
  const trackAdClick = (placement, ad) => {
    const clickData = {
      adId: ad.id || `${placement}-${Date.now()}`,
      placement: placement,
      company: ad.company || 'Unknown',
      timestamp: new Date().toISOString(),
      url: ad.link,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    }

    // Store click data in localStorage
    const existingClicks = JSON.parse(localStorage.getItem('adClicks') || '[]')
    existingClicks.push(clickData)
    localStorage.setItem('adClicks', JSON.stringify(existingClicks))

    console.log('Ad click tracked:', clickData)
  }

  const trackAdImpression = (placement, ad) => {
    const impressionData = {
      adId: ad.id || `${placement}-${Date.now()}`,
      placement: placement,
      company: ad.company || 'Unknown',
      timestamp: new Date().toISOString(),
      viewDuration: 0, // Will be updated when ad leaves viewport
      userAgent: navigator.userAgent,
      referrer: document.referrer
    }

    // Store impression data in localStorage
    const existingImpressions = JSON.parse(localStorage.getItem('adImpressions') || '[]')
    existingImpressions.push(impressionData)
    localStorage.setItem('adImpressions', JSON.stringify(existingImpressions))

    console.log('Ad impression tracked:', impressionData)
  }

  // Track impression when ad is rendered
  useEffect(() => {
    if (demoAd) {
      trackAdImpression(placement, demoAd)
    }
  }, [demoAd, placement])

  // Don't render anything if not in demo mode (after all hooks are called)
  if (!isDemoMode || !demoAd) {
    return fallbackContent
  }

  // Handle Learn More button click (separate from main ad click)
  const handleLearnMoreClick = (e) => {
    e.stopPropagation() // Prevent triggering parent click
    if (demoAd.link) {
      console.log(`Learn More clicked - navigating to: ${demoAd.link}`)
      window.open(demoAd.link, '_blank', 'noopener,noreferrer')
    }
  }

  const renderBannerAd = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg overflow-hidden cursor-pointer group ${className}`}
      style={{ minHeight: '90px', ...style }}
      onClick={handleAdClick}
    >
      {/* Background Media for Custom Ads */}
      {demoAd.image && (
        <>
          {demoAd.type === 'video' || demoAd.image.includes('.mp4') || demoAd.image.includes('.webm') ? (
            <video
              src={demoAd.image}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={demoAd.image}
              alt="Demo Ad"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}

      {/* Ad Label */}
      {showLabel && (
        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          AD
        </div>
      )}

      {/* Ad Content */}
      <div className="relative flex items-center h-full p-4 z-10">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{demoAd.text}</h3>
          <p className="text-blue-100 text-sm">{demoAd.description || 'Professional aviation solutions'}</p>
        </div>
        <div className="ml-4">
          <button
            onClick={handleLearnMoreClick}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors group-hover:scale-105 transform flex items-center space-x-2"
          >
            <span>{demoAd.cta || 'Learn More'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )

  const renderSidebarAd = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group border border-gray-200 dark:border-gray-700 ml-4 ${className}`}
      style={{ width: '350px', height: '400px', ...style }}
      onClick={handleAdClick}
    >
      {/* Ad Label */}
      {showLabel && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          AD
        </div>
      )}

      {/* Ad Media/Background */}
      {demoAd.image ? (
        demoAd.type === 'video' || demoAd.image.includes('.mp4') || demoAd.image.includes('.webm') ? (
          <video
            src={demoAd.image}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img
            src={demoAd.image}
            alt="Demo Ad"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
      )}

      {/* Overlay for text readability */}
      {demoAd.image && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      {/* Ad Content */}
      <div className="relative h-full flex flex-col justify-between p-4 text-white">
        <div>
          <h3 className="font-bold text-lg mb-2">{demoAd.text}</h3>
          <p className="text-blue-100 text-sm">{demoAd.description || 'Professional aviation solutions'}</p>
        </div>
        <button
          onClick={handleLearnMoreClick}
          className="bg-white text-blue-600 px-3 py-2 rounded font-medium hover:bg-blue-50 transition-colors self-start group-hover:scale-105 transform flex items-center space-x-2"
        >
          <span>{demoAd.cta || 'Learn More'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )

  const renderVideoAd = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer group ml-10 ${className}`}
      style={{ width: '400px', height: '280px', ...style }}
      onClick={handleAdClick}
    >
      {/* Ad Label */}
      {showLabel && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          VIDEO AD
        </div>
      )}
      
      {/* Video Thumbnail */}
      {demoAd.image ? (
        demoAd.type === 'video' || demoAd.image.includes('.mp4') || demoAd.image.includes('.webm') ? (
          <video
            src={demoAd.image}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img
            src={demoAd.image}
            alt="Video Thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
      )}
      
      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
      </div>
      
      {/* Video Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-medium">{demoAd.title || demoAd.text}</h3>
        <p className="text-gray-300 text-sm">{demoAd.duration || '0:30'} • {demoAd.description || 'Professional video content'}</p>
      </div>
    </motion.div>
  )

  const renderSponsoredContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      style={style}
    >
      {/* Ad Label */}
      {showLabel && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          AD
        </div>
      )}
      
      {/* Sponsored Label */}
      <div className="bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 border-b border-gray-200 dark:border-gray-700">
        <span className="text-yellow-700 dark:text-yellow-400 text-xs font-medium">SPONSORED CONTENT</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{demoAd.title || demoAd.text}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{demoAd.content || demoAd.description || 'Professional sponsored content'}</p>
        <button
          onClick={handleLearnMoreClick}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center space-x-1"
        >
          <span>{demoAd.cta || 'Learn More'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )

  // Video Modal
  const VideoModal = () => (
    <AnimatePresence>
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg overflow-hidden max-w-4xl w-full max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-medium">{demoAd.title}</h3>
                <p className="text-gray-400 text-sm">{demoAd.description}</p>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Video Player */}
            <div className="relative bg-black aspect-video">
              {demoAd.image && (demoAd.type === 'video' || demoAd.image.includes('.mp4') || demoAd.image.includes('.webm')) ? (
                <video
                  src={demoAd.image}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay={isVideoPlaying}
                  muted={isMuted}
                  playsInline
                />
              ) : demoAd.image ? (
                <img
                  src={demoAd.image}
                  alt="Ad Content"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 inline-block">
                      {isVideoPlaying ? (
                        <Pause className="w-12 h-12" />
                      ) : (
                        <Play className="w-12 h-12 ml-1" />
                      )}
                    </div>
                    <p className="text-lg font-medium">{demoAd.title || demoAd.text}</p>
                    <p className="text-gray-300">{demoAd.duration || '0:30'} Demo Content</p>
                  </div>
                </div>
              )}

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 bg-gray-600 h-1 rounded">
                      <div className="bg-white h-1 rounded w-1/3"></div>
                    </div>
                    <span className="text-white text-sm">0:10 / 0:30</span>
                  </div>

                  {/* Learn More Button for Video Ads */}
                  {demoAd.link && (
                    <button
                      onClick={handleLearnMoreClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ml-4"
                    >
                      <span>{demoAd.cta || 'Learn More'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Render appropriate ad type
  const renderAd = () => {
    switch (placement) {
      case 'banner':
        return renderBannerAd()
      case 'sidebar':
        return renderSidebarAd()
      case 'video':
        return renderVideoAd()
      case 'sponsored':
        return renderSponsoredContent()
      default:
        return renderBannerAd()
    }
  }

  return (
    <>
      {renderAd()}
      <VideoModal />
    </>
  )
}

export default DemoAdContainer
