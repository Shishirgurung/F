import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  MousePointer, 
  Eye, 
  Clock,
  ExternalLink,
  Calendar,
  Users,
  Globe
} from 'lucide-react'

const RealAdAnalytics = () => {
  const [adClicks, setAdClicks] = useState([])
  const [adImpressions, setAdImpressions] = useState([])
  const [timeRange, setTimeRange] = useState('today')

  useEffect(() => {
    // Load real tracking data from localStorage
    const clicks = JSON.parse(localStorage.getItem('adClicks') || '[]')
    const impressions = JSON.parse(localStorage.getItem('adImpressions') || '[]')
    
    setAdClicks(clicks)
    setAdImpressions(impressions)
  }, [])

  // Filter data by time range
  const filterByTimeRange = (data) => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfDay.getTime() - (startOfDay.getDay() * 24 * 60 * 60 * 1000))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return data.filter(item => {
      const itemDate = new Date(item.timestamp)
      switch (timeRange) {
        case 'today':
          return itemDate >= startOfDay
        case 'week':
          return itemDate >= startOfWeek
        case 'month':
          return itemDate >= startOfMonth
        default:
          return true
      }
    })
  }

  const filteredClicks = filterByTimeRange(adClicks)
  const filteredImpressions = filterByTimeRange(adImpressions)

  // Calculate metrics
  const totalClicks = filteredClicks.length
  const totalImpressions = filteredImpressions.length
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'

  // Group by placement
  const clicksByPlacement = filteredClicks.reduce((acc, click) => {
    acc[click.placement] = (acc[click.placement] || 0) + 1
    return acc
  }, {})

  const impressionsByPlacement = filteredImpressions.reduce((acc, impression) => {
    acc[impression.placement] = (acc[impression.placement] || 0) + 1
    return acc
  }, {})

  // Group by company
  const clicksByCompany = filteredClicks.reduce((acc, click) => {
    acc[click.company] = (acc[click.company] || 0) + 1
    return acc
  }, {})

  const impressionsByCompany = filteredImpressions.reduce((acc, impression) => {
    acc[impression.company] = (acc[impression.company] || 0) + 1
    return acc
  }, {})

  const clearAnalytics = () => {
    localStorage.removeItem('adClicks')
    localStorage.removeItem('adImpressions')
    setAdClicks([])
    setAdImpressions([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Real Ad Performance Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Live tracking of ad clicks and impressions
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          
          <button
            onClick={clearAnalytics}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Impressions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalImpressions}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MousePointer className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clicks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClicks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">CTR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{ctr}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Companies</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(clicksByCompany).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance by Placement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Performance by Placement</span>
          </h3>
          
          <div className="space-y-4">
            {Object.entries(clicksByPlacement).map(([placement, clicks]) => {
              const impressions = impressionsByPlacement[placement] || 0
              const placementCtr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00'
              
              return (
                <div key={placement} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{placement}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {impressions} impressions • {clicks} clicks
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{placementCtr}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">CTR</p>
                  </div>
                </div>
              )
            })}
            
            {Object.keys(clicksByPlacement).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No ad interactions yet. Upload and display ads to see performance data.
              </p>
            )}
          </div>
        </motion.div>

        {/* Performance by Company */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Performance by Company</span>
          </h3>
          
          <div className="space-y-4">
            {Object.entries(clicksByCompany).map(([company, clicks]) => {
              const impressions = impressionsByCompany[company] || 0
              const companyCtr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00'
              
              return (
                <div key={company} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{company}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {impressions} impressions • {clicks} clicks
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{companyCtr}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">CTR</p>
                  </div>
                </div>
              )
            })}
            
            {Object.keys(clicksByCompany).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No company data yet. Upload ads to see company performance.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RealAdAnalytics
