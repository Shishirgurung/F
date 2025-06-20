import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Eye,
  EyeOff,
  Upload,
  BarChart3,
  Users,
  Monitor,
  Smartphone,
  Globe,
  TrendingUp,
  DollarSign,
  Target,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { useAdDemo } from '../../contexts/AdDemoContext'

const AdminDemoPanel = () => {
  const {
    isDemoMode,
    currentDemo,
    isAdminAuthenticated,
    adTemplates,
    adminPassword,
    setAdminPassword,
    authenticateAdmin,
    logoutAdmin,
    enableDemoMode,
    disableDemoMode,
    switchDemoCompany,
    getCurrentMetrics,
    getAllCompanies
  } = useAdDemo()

  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState('control')
  const [authError, setAuthError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const success = authenticateAdmin(adminPassword)
    if (success) {
      setAuthError('')
      setShowPanel(true)
    } else {
      setAuthError('Invalid password')
    }
  }

  const handleDemoToggle = () => {
    if (isDemoMode) {
      disableDemoMode()
    } else {
      enableDemoMode()
    }
  }

  const metrics = getCurrentMetrics()

  if (!isAdminAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          onClick={() => setShowPanel(!showPanel)}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-80 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Demo Access
                </h3>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Demo Password
                  </label>
                  <input
                    type="text"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Type: aviation-demo-2024"
                    autoComplete="off"
                    style={{
                      color: '#111827 !important',
                      backgroundColor: '#ffffff !important',
                      fontSize: '16px',
                      fontFamily: 'monospace'
                    }}
                    required
                  />
                  {/* Debug info - remove this later */}
                  <p className="text-xs text-gray-500 mt-1">
                    Current value length: {adminPassword.length} | Type: aviation-demo-2024
                  </p>
                  {authError && (
                    <p className="text-red-500 text-sm mt-1">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Access Demo Panel</span>
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  <strong>Demo Password:</strong> aviation-demo-2024
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  Use this panel to demonstrate ad placements to potential clients
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Demo Status Indicator */}
      <div className="absolute -top-12 right-0 flex items-center space-x-2">
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>Demo Active</span>
            {currentDemo && (
              <span className="ml-1 opacity-75">- {currentDemo.company}</span>
            )}
          </motion.div>
        )}
      </div>

      {/* Main Panel Toggle */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className={`p-3 rounded-full shadow-lg transition-colors ${
          isDemoMode 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Demo Control Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-96 max-h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Ad Demo Control</h3>
                </div>
                <button
                  onClick={logoutAdmin}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'control', label: 'Control', icon: Play },
                { id: 'metrics', label: 'Metrics', icon: BarChart3 },
                { id: 'companies', label: 'Companies', icon: Users }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {activeTab === 'control' && (
                <div className="space-y-4">
                  {/* Demo Mode Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {isDemoMode ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <span className="font-medium text-gray-900 dark:text-white">Demo Mode</span>
                    </div>
                    <button
                      onClick={handleDemoToggle}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isDemoMode
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {isDemoMode ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  {/* Current Demo */}
                  {isDemoMode && currentDemo && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">Active Demo</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 font-semibold">{currentDemo.company}</p>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">{currentDemo.industry}</p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => enableDemoMode('boeing-demo')}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Boeing Demo
                      </button>
                      <button
                        onClick={() => enableDemoMode('airbus-demo')}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        Airbus Demo
                      </button>
                      <button
                        onClick={() => enableDemoMode('shell-demo')}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                      >
                        Shell Demo
                      </button>
                      <button
                        onClick={() => enableDemoMode('rolls-royce-demo')}
                        className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        Rolls-Royce Demo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metrics' && metrics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Impressions</span>
                      </div>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {metrics.impressions?.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">CTR</span>
                      </div>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        {metrics.ctr}%
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Conversions</span>
                      </div>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        {metrics.conversions}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-orange-900 dark:text-orange-100">ROI</span>
                      </div>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {metrics.roi}%
                      </p>
                    </div>
                  </div>

                  {/* Demographics */}
                  {metrics.demographics && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Audience Demographics</h5>
                      <div className="space-y-1">
                        {Object.entries(metrics.demographics).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'companies' && (
                <div className="space-y-3">
                  {getAllCompanies().map(template => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                        (currentDemo?.id === template.id || currentDemo?.company === template.company)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => switchDemoCompany(template.isCustom ? template.company : template.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {template.company}
                            {template.isCustom && (
                              <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                                Custom
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{template.industry}</p>
                        </div>
                        {(currentDemo?.id === template.id || currentDemo?.company === template.company) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDemoPanel
