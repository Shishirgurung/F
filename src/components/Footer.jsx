import React from 'react'
import { Link } from 'react-router-dom'
import { Plane, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">Carbon Tracker</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Real-time global aviation emissions tracking and analytics. 
              Monitor environmental impact of air travel with authentic data.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contact@carbontracker.com" className="text-gray-300 hover:text-white">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+15551234567" className="text-gray-300 hover:text-white">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-white transition-colors">
                  Live Map
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white transition-colors">
                  Search Flights
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Carbon Tracker. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Data provided by OpenSky Network and other public sources
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
