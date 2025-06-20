import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Leaf, 
  Award, 
  Calendar, 
  Plane, 
  Download,
  TrendingUp,
  BarChart3,
  Zap,
  Factory,
  Waves
} from 'lucide-react'

const OffsetHistory = ({ onClose }) => {
  const [offsetPurchases, setOffsetPurchases] = useState([])
  const [totalStats, setTotalStats] = useState({
    totalCO2Offset: 0,
    totalCost: 0,
    totalImpact: 0,
    purchaseCount: 0
  })

  useEffect(() => {
    // Load offset purchases from localStorage
    const purchases = JSON.parse(localStorage.getItem('carbonOffsetPurchases') || '[]')
    setOffsetPurchases(purchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)))

    // Calculate total stats
    const stats = purchases.reduce((acc, purchase) => ({
      totalCO2Offset: acc.totalCO2Offset + purchase.co2Offset,
      totalCost: acc.totalCost + purchase.cost,
      totalImpact: acc.totalImpact + purchase.impact,
      purchaseCount: acc.purchaseCount + 1
    }), { totalCO2Offset: 0, totalCost: 0, totalImpact: 0, purchaseCount: 0 })

    setTotalStats(stats)
  }, [])

  const getProjectIcon = (type) => {
    switch (type) {
      case 'trees': return Leaf
      case 'renewable': return Zap
      case 'carbonCapture': return Factory
      case 'ocean': return Waves
      default: return Leaf
    }
  }

  const getProjectColor = (type) => {
    switch (type) {
      case 'trees': return 'green'
      case 'renewable': return 'blue'
      case 'carbonCapture': return 'purple'
      case 'ocean': return 'cyan'
      default: return 'green'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadCertificate = (purchase) => {
    // In a real app, this would generate and download a PDF certificate
    const certificateData = {
      certificateId: purchase.certificate,
      flightCallsign: purchase.flightCallsign,
      co2Offset: purchase.co2Offset,
      projectType: purchase.projectType,
      impact: purchase.impact,
      impactUnit: purchase.impactUnit,
      purchaseDate: purchase.purchaseDate
    }

    const dataStr = JSON.stringify(certificateData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `carbon-offset-certificate-${purchase.certificate}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Carbon Offset History
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your environmental impact and offset certificates
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Environmental Impact
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-600 dark:text-green-400">CO₂ Offset</span>
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {totalStats.totalCO2Offset.toFixed(2)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">tons</div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400">Total Invested</span>
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                ${totalStats.totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">USD</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Leaf className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-600 dark:text-purple-400">Projects</span>
              </div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {totalStats.purchaseCount}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">offsets</div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-orange-600 dark:text-orange-400">Impact</span>
              </div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {totalStats.totalImpact.toLocaleString()}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">units</div>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Purchase History
          </h3>

          {offsetPurchases.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Offset Purchases Yet
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start offsetting your flight emissions to see your impact here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {offsetPurchases.map((purchase) => {
                const Icon = getProjectIcon(purchase.projectType)
                const color = getProjectColor(purchase.projectType)
                
                return (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {purchase.projectType.charAt(0).toUpperCase() + purchase.projectType.slice(1)} Offset
                            </h4>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full">
                              Certificate: {purchase.certificate}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Flight:</span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {purchase.flightCallsign}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">CO₂ Offset:</span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {purchase.co2Offset} tons
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Impact:</span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {purchase.impact} {purchase.impactUnit}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                ${purchase.cost}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(purchase.purchaseDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => downloadCertificate(purchase)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Download Certificate"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OffsetHistory
