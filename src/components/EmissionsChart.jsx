import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Calendar, TrendingUp } from 'lucide-react'

const EmissionsChart = () => {
  const [timeframe, setTimeframe] = useState('24h')

  // Generate sample data for different timeframes
  const generateData = (timeframe) => {
    const now = new Date()
    const data = []
    
    if (timeframe === '24h') {
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          emissions: Math.floor(Math.random() * 50000) + 30000,
          flights: Math.floor(Math.random() * 2000) + 1000,
          efficiency: Math.random() * 5 + 15
        })
      }
    } else if (timeframe === '7d') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        data.push({
          time: date.toLocaleDateString('en-US', { weekday: 'short' }),
          emissions: Math.floor(Math.random() * 200000) + 800000,
          flights: Math.floor(Math.random() * 10000) + 50000,
          efficiency: Math.random() * 3 + 16
        })
      }
    } else {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        data.push({
          time: date.getDate().toString(),
          emissions: Math.floor(Math.random() * 200000) + 800000,
          flights: Math.floor(Math.random() * 10000) + 50000,
          efficiency: Math.random() * 3 + 16
        })
      }
    }
    
    return data
  }

  const data = generateData(timeframe)
  const timeframes = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {entry.name}: {entry.value.toLocaleString()}
                {entry.dataKey === 'emissions' && ' tons CO₂'}
                {entry.dataKey === 'flights' && ' flights'}
                {entry.dataKey === 'efficiency' && ' kg/km'}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Emissions Trends
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              CO₂ emissions over time
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500"
          >
            {timeframes.map((tf) => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="emissions"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#emissionsGradient)"
              name="CO₂ Emissions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {(data.reduce((sum, d) => sum + d.emissions, 0) / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total CO₂ (tons)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.floor(data.reduce((sum, d) => sum + d.flights, 0) / data.length).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Avg Flights</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {(data.reduce((sum, d) => sum + d.efficiency, 0) / data.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Efficiency (kg/km)</div>
        </div>
      </div>
    </div>
  )
}

export default EmissionsChart
