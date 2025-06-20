import React from 'react'

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using this aviation emissions tracking service, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                Our service provides real-time aviation emissions tracking and analytics using publicly available flight data.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Real-time flight tracking and emissions calculations</li>
                <li>Environmental impact analytics</li>
                <li>Educational content about aviation emissions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Accuracy</h2>
              <p className="text-gray-700 mb-4">
                While we strive for accuracy, flight data and emissions calculations are estimates based on available information and industry standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                Users agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to disrupt or interfere with the service</li>
                <li>Respect the intellectual property rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                The service is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from the use of this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
