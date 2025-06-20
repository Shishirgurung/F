import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TestTube, 
  Upload, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Image, 
  Video,
  FileText,
  Download
} from 'lucide-react'
import { useAdDemo } from '../../contexts/AdDemoContext'

const TestingHelper = () => {
  const { isDemoMode, currentDemo, isAdminAuthenticated } = useAdDemo()
  const [testResults, setTestResults] = useState({})

  const runTest = (testName, testFunction) => {
    try {
      const result = testFunction()
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, message: result }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, message: error.message }
      }))
    }
  }

  const tests = [
    {
      id: 'admin-auth',
      name: 'Admin Authentication',
      description: 'Check if admin is logged in',
      test: () => {
        if (isAdminAuthenticated) {
          return 'Admin successfully authenticated'
        } else {
          throw new Error('Admin not authenticated. Please login with password: aviation-demo-2024')
        }
      }
    },
    {
      id: 'demo-mode',
      name: 'Demo Mode Status',
      description: 'Check if demo mode is active',
      test: () => {
        if (isDemoMode) {
          return `Demo mode active${currentDemo ? ` - ${currentDemo.company}` : ''}`
        } else {
          throw new Error('Demo mode not active. Enable demo mode in admin panel.')
        }
      }
    },
    {
      id: 'demo-content',
      name: 'Demo Content Available',
      description: 'Check if demo content is loaded',
      test: () => {
        if (currentDemo && currentDemo.ads) {
          const adTypes = Object.keys(currentDemo.ads)
          return `Demo content loaded: ${adTypes.join(', ')}`
        } else {
          throw new Error('No demo content available. Select a company in admin panel.')
        }
      }
    },
    {
      id: 'local-storage',
      name: 'Local Storage',
      description: 'Check if demo state is persisted',
      test: () => {
        const demoMode = localStorage.getItem('adDemoMode')
        const currentDemoData = localStorage.getItem('currentAdDemo')
        if (demoMode === 'true' && currentDemoData) {
          return 'Demo state properly persisted in local storage'
        } else {
          throw new Error('Demo state not persisted. Try enabling demo mode again.')
        }
      }
    }
  ]

  const runAllTests = () => {
    tests.forEach(test => {
      runTest(test.id, test.test)
    })
  }

  const sampleImages = [
    {
      name: 'Banner Ad Sample',
      size: '728x90',
      description: 'Wide banner for top placement',
      color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      text: 'Your Company - Aviation Solutions'
    },
    {
      name: 'Sidebar Ad Sample',
      size: '300x250',
      description: 'Square ad for sidebar placement',
      color: 'bg-gradient-to-br from-green-500 to-blue-600',
      text: 'Sustainable Aviation Technology'
    },
    {
      name: 'Video Thumbnail Sample',
      size: '300x200',
      description: 'Video preview thumbnail',
      color: 'bg-gradient-to-br from-purple-600 to-pink-600',
      text: 'Play Video Ad'
    }
  ]

  const downloadSampleImage = (sample) => {
    // Create a canvas to generate sample image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const [width, height] = sample.size.split('x').map(Number)
    canvas.width = width
    canvas.height = height
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#3B82F6')
    gradient.addColorStop(1, '#8B5CF6')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Add text
    ctx.fillStyle = 'white'
    ctx.font = `${Math.min(width / 15, 24)}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(sample.text, width / 2, height / 2)
    
    // Add size label
    ctx.font = `${Math.min(width / 25, 14)}px Arial`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(`${sample.size} pixels`, width / 2, height - 20)
    
    // Download the image
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${sample.name.toLowerCase().replace(/\s+/g, '-')}-${sample.size}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TestTube className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Ad Demo Testing Helper
        </h2>
      </div>

      {/* System Tests */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Tests
          </h3>
          <button
            onClick={runAllTests}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <TestTube className="w-4 h-4" />
            <span>Run All Tests</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map(test => (
            <div key={test.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {test.name}
                </h4>
                <button
                  onClick={() => runTest(test.id, test.test)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {test.description}
              </p>
              
              {testResults[test.id] && (
                <div className={`flex items-center space-x-2 text-sm ${
                  testResults[test.id].success 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {testResults[test.id].success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{testResults[test.id].message}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sample Images */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Download Sample Test Images
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Download these sample images to test the upload functionality:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleImages.map((sample, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className={`${sample.color} rounded-lg p-4 mb-3 text-white text-center`}>
                <div className="font-medium text-sm mb-1">{sample.text}</div>
                <div className="text-xs opacity-75">{sample.size} pixels</div>
              </div>
              
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {sample.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {sample.description}
              </p>
              
              <button
                onClick={() => downloadSampleImage(sample)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Quick Testing Steps:
        </h3>
        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>1. <strong>Run system tests</strong> to verify everything is working</li>
          <li>2. <strong>Download sample images</strong> using buttons above</li>
          <li>3. <strong>Go to Content Manager</strong> tab and upload the images</li>
          <li>4. <strong>Enable demo mode</strong> and navigate to Dashboard</li>
          <li>5. <strong>Check ad placements</strong> - you should see your uploaded ads</li>
        </ol>
      </div>

      {/* Current Status */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current Status:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Admin Status:</span>
            <span className={`ml-2 font-medium ${
              isAdminAuthenticated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isAdminAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Demo Mode:</span>
            <span className={`ml-2 font-medium ${
              isDemoMode ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {isDemoMode ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600 dark:text-gray-400">Current Demo:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {currentDemo ? currentDemo.company : 'None selected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestingHelper
