import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import {
  Monitor,
  BarChart3,
  Upload,
  Settings,
  Eye,
  Target,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react'
import { useAdDemo } from '../contexts/AdDemoContext'
import DemoAdContainer from '../components/AdDemo/DemoAdContainer'
import AdPerformanceDashboard from '../components/AdDemo/AdPerformanceDashboard'
import RealAdAnalytics from '../components/AdDemo/RealAdAnalytics'
import ContentUploadManager from '../components/AdDemo/ContentUploadManager'
import TestingHelper from '../components/AdDemo/TestingHelper'

const AdDemo = () => {
  const { isDemoMode, currentDemo, isAdminAuthenticated } = useAdDemo()
  const [activeSection, setActiveSection] = useState('preview')

  // Redirect non-admin users to dashboard
  if (!isAdminAuthenticated) {
    return <Navigate to="/" replace />
  }

  const sections = [
    { id: 'preview', label: 'Ad Preview', icon: Monitor },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'realanalytics', label: 'Real Ad Analytics', icon: TrendingUp },
    { id: 'upload', label: 'Content Manager', icon: Upload },
    { id: 'testing', label: 'Testing Helper', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Ad Management Center</h1>
                <p className="text-purple-100 text-lg">
                  Professional advertising platform with real-time analytics
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${isDemoMode ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span className="text-sm font-medium">
                    {isDemoMode ? 'Ads Active' : 'Ads Inactive'}
                  </span>
                </div>
                {currentDemo && (
                  <p className="text-purple-200 text-sm">
                    Showing: {currentDemo.company}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'testing' && <TestingHelper />}

          {activeSection === 'preview' && (
            <div className="space-y-8">
              {/* Demo Status */}
              {!isDemoMode && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                        Ad System Inactive
                      </h3>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Enable ad system from the admin panel to display ad placements
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ad Placement Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Top Banner Ad */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Top Banner Placement</span>
                    </h3>
                    <DemoAdContainer
                      placement="banner"
                      fallbackContent={
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">Banner Ad Placement (728x90)</span>
                        </div>
                      }
                    />
                  </div>

                  {/* Sample Content */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Aviation Emissions Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      This is sample content showing how ads integrate seamlessly with your aviation emissions tracking platform. 
                      The ads are designed to complement your content without disrupting the user experience.
                    </p>
                    
                    {/* In-Content Ad */}
                    <div className="my-8">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>In-Content Sponsored Placement</span>
                      </h4>
                      <DemoAdContainer
                        placement="sponsored"
                        fallbackContent={
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                            <span className="text-gray-500 dark:text-gray-400">Sponsored Content Placement</span>
                          </div>
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Real-Time Data</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Live flight tracking and emissions</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <Users className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Professional Audience</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Aviation industry professionals</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Global Reach</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide aviation data</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Sidebar Placement</span>
                    </h3>
                    <DemoAdContainer
                      placement="sidebar"
                      fallbackContent={
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-center">
                            Sidebar Ad<br />Placement<br />(300x250)
                          </span>
                        </div>
                      }
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Video Ad Placement</span>
                    </h3>
                    <DemoAdContainer
                      placement="video"
                      fallbackContent={
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-center">
                            Video Ad<br />Placement
                          </span>
                        </div>
                      }
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Ad Placement Benefits</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">High-quality audience</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Industry-relevant content</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Professional environment</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Global reach</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && <AdPerformanceDashboard />}
          {activeSection === 'realanalytics' && <RealAdAnalytics />}
          {activeSection === 'upload' && <ContentUploadManager />}
        </motion.div>

        {/* Demo Instructions */}
        {isAdminAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Ad Management Instructions
                </h3>
                <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <p>• Use the admin panel to enable ad system and switch between companies</p>
                  <p>• Show clients how their ads appear in different placements</p>
                  <p>• Use the Real Ad Analytics section to view actual click and impression data</p>
                  <p>• Upload custom content in the Content Manager for client campaigns</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdDemo
