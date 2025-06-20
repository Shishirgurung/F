// Vercel Serverless Function for Health Check
// This runs automatically without npm run dev!

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    res.status(200).json({
      status: 'OK',
      message: 'Carbon Emissions Tracker API is running',
      timestamp: new Date().toISOString(),
      environment: 'Vercel Serverless',
      version: '1.0.0',
      endpoints: {
        flights: '/api/flights',
        emissions: '/api/emissions',
        health: '/api/health'
      }
    })
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }
}
