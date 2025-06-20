import React from 'react'
import { motion } from 'framer-motion'
import { Plane, Globe } from 'lucide-react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Globe */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-4"
            >
              <Globe className="w-full h-full text-blue-500" />
            </motion.div>
            
            {/* Flying Airplane */}
            <motion.div
              animate={{
                x: [-40, 40, -40],
                y: [-20, 20, -20],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Plane className="w-8 h-8 text-indigo-600 transform rotate-45" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Carbon Emissions Tracker
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-600 dark:text-gray-300 mb-8"
        >
          Real-time Global Aviation Emissions Monitoring
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>

          {/* Loading Text */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Initializing flight tracking systems...
          </motion.div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {[
            { icon: "🌍", title: "Live Tracking", desc: "Real-time flight data" },
            { icon: "📊", title: "Emissions Data", desc: "CO₂ calculations" },
            { icon: "📈", title: "Analytics", desc: "Trends & insights" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingScreen
