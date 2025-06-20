import React from 'react'
import { motion } from 'framer-motion'
import { 
  TreePine, 
  Zap, 
  Waves, 
  Sprout, 
  Users, 
  TrendingUp,
  Globe,
  Heart,
  Star
} from 'lucide-react'

const ImpactVisualization = ({ offsetData, selectedProject }) => {
  const getProjectColor = (project) => {
    switch (project) {
      case 'trees': return 'green'
      case 'renewable': return 'blue'
      case 'carbonCapture': return 'purple'
      case 'ocean': return 'cyan'
      case 'soil': return 'amber'
      case 'lifestyle': return 'emerald'
      default: return 'gray'
    }
  }

  const getProjectIcon = (project) => {
    switch (project) {
      case 'trees': return TreePine
      case 'renewable': return Zap
      case 'carbonCapture': return Globe
      case 'ocean': return Waves
      case 'soil': return Sprout
      case 'lifestyle': return Users
      default: return Star
    }
  }

  const color = getProjectColor(selectedProject)
  const Icon = getProjectIcon(selectedProject)

  return (
    <div className="space-y-6">
      {/* Impact Counter Animation */}
      <motion.div 
        className={`p-6 bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20 rounded-2xl border border-${color}-200 dark:border-${color}-700`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className={`inline-flex items-center justify-center w-16 h-16 bg-${color}-100 dark:bg-${color}-900/30 rounded-full mb-4`}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Icon className={`h-8 w-8 text-${color}-600 dark:text-${color}-400`} />
          </motion.div>
          
          <motion.div
            className={`text-4xl font-bold text-${color}-700 dark:text-${color}-300 mb-2`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {offsetData.impact}
          </motion.div>
          
          <div className={`text-${color}-600 dark:text-${color}-400 font-medium`}>
            {offsetData.impactUnit}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            for {offsetData.co2Tons} tons CO₂
          </div>
        </div>
      </motion.div>

      {/* Progress Bar Animation */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Impact Progress</span>
          <span className={`text-${color}-600 dark:text-${color}-400 font-medium`}>100%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className={`h-3 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Impact Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Environmental Benefit</span>
          </div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            High Impact
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Positive climate action
          </div>
        </motion.div>

        <motion.div
          className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Community Impact</span>
          </div>
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            Meaningful
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Supports local communities
          </div>
        </motion.div>
      </div>

      {/* Timeline Visualization */}
      <motion.div
        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span>Impact Timeline</span>
        </h4>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Today:</strong> Learning and awareness begins
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <strong>This month:</strong> Share knowledge with others
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Long-term:</strong> Contribute to climate solutions
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ImpactVisualization
