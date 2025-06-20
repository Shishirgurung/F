// Vercel Serverless Function for Emissions Data
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
    const { timeframe } = req.query
    
    // Generate realistic emissions data
    const baseEmissions = Math.random() * 50000 + 100000 // 100k-150k tons
    
    const emissionsData = {
      today: baseEmissions,
      thisWeek: baseEmissions * 7,
      thisMonth: baseEmissions * 30,
      thisYear: baseEmissions * 365
    }

    const requestedData = timeframe ? emissionsData[timeframe] : emissionsData

    res.status(200).json({
      success: true,
      timeframe: timeframe || 'all',
      data: requestedData,
      timestamp: new Date().toISOString(),
      source: 'Vercel Serverless API'
    })
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }
}
