import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  Users,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Calendar,
  Download,
  Share2
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAdDemo } from '../../contexts/AdDemoContext'

const AdPerformanceDashboard = () => {
  const { isDemoMode, currentDemo, getCurrentMetrics } = useAdDemo()
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('impressions')

  const metrics = getCurrentMetrics()

  // Generate sample time series data
  const generateTimeSeriesData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const data = []
    
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const baseImpressions = metrics?.impressions || 100000
      const dailyImpressions = Math.floor((baseImpressions / days) * (0.8 + Math.random() * 0.4))
      const clicks = Math.floor(dailyImpressions * (metrics?.ctr || 3) / 100)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: dailyImpressions,
        clicks: clicks,
        conversions: Math.floor(clicks * 0.05),
        revenue: Math.floor(clicks * 0.75)
      })
    }
    
    return data
  }

  const timeSeriesData = generateTimeSeriesData()

  // Device breakdown data
  const deviceData = metrics?.devices ? [
    { name: 'Desktop', value: metrics.devices.desktop, color: '#3B82F6' },
    { name: 'Mobile', value: metrics.devices.mobile, color: '#10B981' },
    { name: 'Tablet', value: metrics.devices.tablet, color: '#F59E0B' }
  ] : []

  // Geographic data
  const geoData = metrics?.geographic ? [
    { name: 'North America', value: metrics.geographic.north_america, color: '#8B5CF6' },
    { name: 'Europe', value: metrics.geographic.europe, color: '#EF4444' },
    { name: 'Asia Pacific', value: metrics.geographic.asia_pacific, color: '#06B6D4' },
    { name: 'Other', value: metrics.geographic.other, color: '#84CC16' }
  ] : []

  if (!isDemoMode || !currentDemo || !metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Ad Performance Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enable demo mode to view performance analytics
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ad Performance Analytics</h2>
            <p className="text-blue-100">
              {currentDemo.company} • {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
            <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.impressions?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">+12.5%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MousePointer className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click-Through Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.ctr}%
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">+0.3%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.conversions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">+8.7%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.roi}%
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">+15.2%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trends</h3>
          <div className="flex items-center space-x-2">
            {['impressions', 'clicks', 'conversions'].map(metric => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics and Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Device Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Geographic Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audience Demographics */}
      {metrics.demographics && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Audience Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(metrics.demographics).map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {value}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-900 dark:text-blue-100 font-medium">Demo Analytics</span>
        </div>
        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
          This dashboard shows simulated performance data for demonstration purposes. 
          Real campaigns would provide actual metrics and insights.
        </p>
      </div>
    </div>
  )
}

export default AdPerformanceDashboard
