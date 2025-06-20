import React from 'react'
import { motion } from 'framer-motion'
import { 
  Plane, 
  Globe, 
  BarChart3, 
  Users, 
  Target, 
  Lightbulb,
  Heart,
  ExternalLink,
  Mail,
  Github
} from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Globe,
      title: 'Real-Time Tracking',
      description: 'Live flight data from global aviation networks with real-time position updates.'
    },
    {
      icon: BarChart3,
      title: 'Emissions Calculation',
      description: 'Accurate CO₂ calculations based on ICAO methodology and aircraft specifications.'
    },
    {
      icon: Plane,
      title: 'Aircraft Database',
      description: 'Comprehensive database of aircraft types with fuel consumption and emission factors.'
    },
    {
      icon: Users,
      title: 'Environmental Impact',
      description: 'Per-passenger emissions and carbon offset recommendations for conscious travelers.'
    }
  ]

  const team = [
    {
      name: 'Aviation Data Team',
      role: 'Real-time flight tracking and data processing',
      description: 'Specialists in aviation data integration and real-time processing systems.'
    },
    {
      name: 'Environmental Scientists',
      role: 'Emissions calculation and methodology',
      description: 'Experts in carbon footprint analysis and environmental impact assessment.'
    },
    {
      name: 'Software Engineers',
      role: 'Platform development and user experience',
      description: 'Full-stack developers focused on creating intuitive and responsive interfaces.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Plane className="h-10 w-10" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Carbon Emissions Tracker
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Real-time global aviation emissions monitoring for a more sustainable future
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              View Live Data
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              To provide transparent, real-time insights into aviation's environmental impact, 
              empowering individuals, organizations, and policymakers to make informed decisions 
              for a more sustainable future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Transparency
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Open access to real-time aviation emissions data for researchers, policymakers, and the public.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Accuracy
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Scientifically-backed emissions calculations using ICAO standards and real-time flight data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Driving positive change through awareness and actionable insights for carbon reduction.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="py-20 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Comprehensive tools for understanding aviation's environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Experts in aviation, environmental science, and technology
            </p>
          </div>

          <div className="space-y-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="py-20 bg-gray-900 text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-300 mb-8">
            Questions, feedback, or collaboration opportunities? We'd love to hear from you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@carbontracker.com"
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Us</span>
            </a>
            <a
              href="https://github.com/carbontracker"
              className="flex items-center justify-center space-x-2 border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-lg transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default About
