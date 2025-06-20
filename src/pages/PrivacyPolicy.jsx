import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you use our aviation emissions tracking service.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Flight tracking preferences and settings</li>
                <li>Usage analytics to improve our service</li>
                <li>Device information for optimal performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and maintain our aviation tracking service</li>
                <li>Improve and personalize your experience</li>
                <li>Analyze usage patterns and trends</li>
                <li>Communicate with you about service updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Sources</h2>
              <p className="text-gray-700 mb-4">
                Our aviation data comes from legitimate public sources including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>OpenSky Network - Real-time flight tracking data</li>
                <li>Public aviation databases</li>
                <li>Environmental impact calculations based on industry standards</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience and analyze site usage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services for analytics and advertising, including Google AdSense.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
