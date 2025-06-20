import React from 'react'

// Ultra-simple test map component
const TestMapComponent = ({ flights = [] }) => {
  console.log('🧪 TestMapComponent rendering with', flights.length, 'flights')
  
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        backgroundColor: '#3B82F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        position: 'relative'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <div>TEST MAP WORKING!</div>
        <div style={{ fontSize: '18px', marginTop: '8px' }}>{flights.length} flights loaded</div>
        <div style={{ fontSize: '14px', marginTop: '16px', opacity: 0.75 }}>
          If you see this, the component system is working
        </div>

        {/* Flight markers for testing */}
        {flights.slice(0, 5).map((flight, index) => (
          <div
            key={flight.id || index}
            style={{
              position: 'absolute',
              left: `${20 + index * 15}%`,
              top: `${30 + index * 10}%`,
              width: '20px',
              height: '20px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}
          >
            ✈
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestMapComponent
