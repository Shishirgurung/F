import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Leaf,
  Zap,
  Factory,
  Waves,
  Check,
  CreditCard,
  Shield,
  Award,
  Info,
  ChevronRight,
  Sprout,
  TreePine,
  Users,
  Globe,
  TrendingUp,
  Heart,
  Star,
  Sparkles
} from 'lucide-react'
import { calculateCarbonOffset, getOffsetProjects } from '../utils/emissionsCalculator'
import ImpactVisualization from './ImpactVisualization'

const CarbonOffsetModal = ({ isOpen, onClose, flight, emissions }) => {
  const [selectedProject, setSelectedProject] = useState('trees')
  const [step, setStep] = useState(1) // 1: Select Project, 2: Learn & Act, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen || !emissions) return null

  const offsetData = calculateCarbonOffset(emissions.co2 || 0, selectedProject, true) // true for educational
  const projects = getOffsetProjects()

  const getProjectIcon = (type) => {
    switch (type) {
      case 'trees': return TreePine
      case 'renewable': return Zap
      case 'carbonCapture': return Factory
      case 'ocean': return Waves
      case 'soil': return Sprout
      case 'lifestyle': return Users
      default: return Leaf
    }
  }

  const handleLearnAndAct = async () => {
    setIsProcessing(true)

    // Simulate learning process
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Store educational action (awareness tracking)
    const action = {
      id: offsetData.certificate,
      flightId: flight.id,
      flightCallsign: flight.callsign,
      projectType: selectedProject,
      co2Offset: offsetData.co2Tons,
      impact: offsetData.impact,
      impactUnit: offsetData.impactUnit,
      actionDate: new Date().toISOString(),
      certificate: offsetData.certificate,
      educationalContent: offsetData.educationalValue
    }

    // Save to localStorage for awareness tracking
    const existingActions = JSON.parse(localStorage.getItem('carbonAwarenessActions') || '[]')
    existingActions.push(action)
    localStorage.setItem('carbonAwarenessActions', JSON.stringify(existingActions))

    setIsProcessing(false)
    setStep(3)
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Learn About Climate Action
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Flight {flight.callsign} • {offsetData.co2Tons} tons CO₂ • FREE Education
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

              {/* Progress Steps */}
              <div className="flex items-center space-x-4 mt-6">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNum 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {step > stepNum ? <Check className="h-4 w-4" /> : stepNum}
                    </div>
                    {stepNum < 3 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step > stepNum ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Project Selection */}
            {step === 1 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose What You'd Like to Learn About
                </h3>
                
                <div className="grid gap-4 mb-6">
                  {Object.entries(projects).map(([key, project]) => {
                    const Icon = getProjectIcon(key)
                    const isSelected = selectedProject === key

                    return (
                      <motion.div
                        key={key}
                        onClick={() => setSelectedProject(key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <motion.div
                            className={`p-3 rounded-lg ${
                              isSelected
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                            animate={isSelected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon className={`h-6 w-6 ${
                              isSelected
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`} />
                          </motion.div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                <span>{project.icon}</span>
                                <span>{project.name}</span>
                                {isSelected && <Sparkles className="h-4 w-4 text-green-500" />}
                              </h4>
                              <motion.span
                                className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center space-x-1"
                                animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Star className="h-4 w-4" />
                                <span>FREE</span>
                              </motion.span>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {project.description}
                            </p>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>Impact: {project.timeframe}</span>
                              </span>
                              <div className="flex space-x-2">
                                {project.benefits.slice(0, 2).map((benefit, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                                    <Heart className="h-3 w-3" />
                                    <span>{benefit}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Enhanced Learning Summary */}
                <motion.div
                  className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Learning Impact Summary</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {offsetData.co2Tons}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">tons CO₂ to learn about</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {offsetData.impact}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{offsetData.impactUnit}</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <Info className="h-4 w-4" />
                        <span>Educational Value</span>
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">Priceless</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>Climate Knowledge</span>
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">Unlimited</span>
                    </div>
                    <div className="border-t border-green-200 dark:border-green-600 pt-3 flex justify-between items-center font-bold">
                      <span className="text-gray-900 dark:text-white flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Total Investment</span>
                      </span>
                      <motion.span
                        className="text-green-600 dark:text-green-400 text-xl flex items-center space-x-1"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span>FREE!</span>
                        <Sparkles className="h-5 w-5" />
                      </motion.span>
                    </div>
                  </div>
                </motion.div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>Learn & Take Action</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: Learn & Act */}
            {step === 2 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {offsetData.educationalValue?.title || 'Learn & Take Action'}
                </h3>

                {/* Impact Visualization */}
                <div className="mb-6">
                  <ImpactVisualization
                    offsetData={offsetData}
                    selectedProject={selectedProject}
                  />
                </div>

                {/* Educational Content Header */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {projects[selectedProject].name}
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      FREE Learning
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Understanding {offsetData.co2Tons} tons CO₂ • {offsetData.impact} {offsetData.impactUnit}
                  </div>
                </div>

                {/* Facts Section */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">📚 Did You Know?</h4>
                  <div className="space-y-2">
                    {offsetData.educationalValue?.facts?.map((fact, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">🌱 Actions You Can Take</h4>
                  <div className="space-y-2">
                    {offsetData.educationalValue?.actions?.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awareness Notice */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Free Climate Education
                      </p>
                      <p className="text-green-600 dark:text-green-300">
                        This is completely free! We believe education and awareness are the first steps
                        toward meaningful climate action. Share what you learn with others!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleLearnAndAct}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Learning...' : 'Complete Learning'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Learning Complete! 🌱
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Great job! You've learned about climate action and how to make a positive impact.
                  Knowledge is the first step toward change!
                </p>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">CO₂ Learned About</div>
                      <div className="font-bold text-gray-900 dark:text-white">{offsetData.co2Tons} tons</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Knowledge Gained</div>
                      <div className="font-bold text-gray-900 dark:text-white">{offsetData.impact} {offsetData.impactUnit}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Awareness Certificate</div>
                      <div className="font-bold text-gray-900 dark:text-white text-xs">{offsetData.certificate}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Learning Topic</div>
                      <div className="font-bold text-gray-900 dark:text-white">{projects[selectedProject].name}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Next Steps:</strong> Share what you learned with friends and family!
                    Small actions by many people create big changes.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Share Your Knowledge
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CarbonOffsetModal
