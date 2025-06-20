import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Database, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useFlightData } from '../contexts/FlightDataContext'

const DataSourceIndicator = ({ className = '' }) => {
  const { dataSource, useRealData, loading, isUpdating, error, lastUpdate, toggleDataSource } = useFlightData()

  const getStatusInfo = () => {
    if (loading) {
      return {
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        status: 'Loading...',
        description: 'Fetching live flight data'
      }
    }

    if (error) {
      return {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        status: 'Connection Error',
        description: error
      }
    }

    if (dataSource.includes('OpenSky Network (Real-time)')) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        status: 'Live Data',
        description: 'Connected to OpenSky Network'
      }
    }

    if (dataSource.includes('OpenSky Network (No flights')) {
      return {
        icon: Wifi,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        status: 'Live Data',
        description: 'Connected - No flights currently visible'
      }
    }

    if (dataSource.includes('OpenSky Network (Connection failed)')) {
      return {
        icon: WifiOff,
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        status: 'Connection Failed',
        description: 'Unable to connect to OpenSky Network'
      }
    }

    if (dataSource.includes('Limited Sample - CORS Restricted')) {
      return {
        icon: Wifi,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        status: 'Limited Sample',
        description: 'Showing sample flights (API access restricted in browser)'
      }
    }

    if (dataSource.includes('Demo')) {
      return {
        icon: Database,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-200 dark:border-purple-800',
        status: 'Demo Mode',
        description: 'Using simulated flight data'
      }
    }

    return {
      icon: AlertCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      status: 'Unknown',
      description: dataSource
    }
  }

  const statusInfo = getStatusInfo()
  const Icon = statusInfo.icon

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never'
    const now = new Date()
    const diff = Math.floor((now - lastUpdate) / 1000)
    
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Icon className={`w-5 h-5 ${statusInfo.color}`} />
            {isUpdating && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${statusInfo.color}`}>
                {statusInfo.status}
              </span>
              {!loading && !error && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {formatLastUpdate()}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {statusInfo.description}
            </p>
          </div>
        </div>

        {/* Data Source Toggle (for development/testing) */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={toggleDataSource}
            className="ml-3 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={`Switch to ${useRealData ? 'Demo' : 'Real'} data`}
          >
            {useRealData ? 'Real' : 'Demo'}
          </button>
        )}
      </div>

      {/* Connection Status Details */}
      {!loading && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>Source: {dataSource}</span>
            {isUpdating && (
              <span className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <span>Updating...</span>
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default DataSourceIndicator
