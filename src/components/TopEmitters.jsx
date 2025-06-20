import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Plane, Building2, MapPin, TrendingUp } from 'lucide-react'

// Comprehensive country flag emojis mapping
const countryFlags = {
  // North America
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'Mexico': '🇲🇽',
  'Cuba': '🇨🇺',
  'Jamaica': '🇯🇲',
  'Costa Rica': '🇨🇷',
  'Guatemala': '🇬🇹',

  // Europe
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Netherlands': '🇳🇱',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Austria': '🇦🇹',
  'Switzerland': '🇨🇭',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Finland': '🇫🇮',
  'Poland': '🇵🇱',
  'Czech Republic': '🇨🇿',
  'Hungary': '🇭🇺',
  'Romania': '🇷🇴',
  'Bulgaria': '🇧🇬',
  'Greece': '🇬🇷',
  'Turkey': '🇹🇷',
  'Lithuania': '🇱🇹',
  'Latvia': '🇱🇻',
  'Estonia': '🇪🇪',
  'Belarus': '🇧🇾',
  'Ukraine': '🇺🇦',
  'Russia': '🇷🇺',
  'Georgia': '🇬🇪',
  'Armenia': '🇦🇲',
  'Azerbaijan': '🇦🇿',
  'Cyprus': '🇨🇾',
  'Malta': '🇲🇹',
  'Bosnia and Herzegovina': '🇧🇦',
  'Slovenia': '🇸🇮',
  'Croatia': '🇭🇷',
  'Montenegro': '🇲🇪',
  'Albania': '🇦🇱',
  'North Macedonia': '🇲🇰',
  'Serbia': '🇷🇸',
  'Ireland': '🇮🇪',
  'Portugal': '🇵🇹',

  // Asia Pacific
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'North Korea': '🇰🇵',
  'Singapore': '🇸🇬',
  'Indonesia': '🇮🇩',
  'Malaysia': '🇲🇾',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Laos': '🇱🇦',
  'Cambodia': '🇰🇭',
  'Myanmar': '🇲🇲',
  'Philippines': '🇵🇭',
  'Taiwan': '🇹🇼',
  'Hong Kong': '🇭🇰',
  'Macau': '🇲🇴',
  'Brunei': '🇧🇳',
  'Australia': '🇦🇺',
  'New Zealand': '🇳🇿',
  'Papua New Guinea': '🇵🇬',
  'Fiji': '🇫🇯',
  'Bangladesh': '🇧🇩',
  'Sri Lanka': '🇱🇰',
  'Nepal': '🇳🇵',
  'Bhutan': '🇧🇹',
  'Afghanistan': '🇦🇫',
  'Pakistan': '🇵🇰',
  'Mongolia': '🇲🇳',

  // Middle East
  'United Arab Emirates': '🇦🇪',
  'Qatar': '🇶🇦',
  'Kuwait': '🇰🇼',
  'Saudi Arabia': '🇸🇦',
  'Yemen': '🇾🇪',
  'Oman': '🇴🇲',
  'Bahrain': '🇧🇭',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Syria': '🇸🇾',
  'Lebanon': '🇱🇧',
  'Israel': '🇮🇱',
  'Palestine': '🇵🇸',
  'Jordan': '🇯🇴',
  'Turkmenistan': '🇹🇲',
  'Uzbekistan': '🇺🇿',
  'Tajikistan': '🇹🇯',
  'Kyrgyzstan': '🇰🇬',
  'Kazakhstan': '🇰🇿',

  // Africa
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Libya': '🇱🇾',
  'Morocco': '🇲🇦',
  'Tunisia': '🇹🇳',
  'Algeria': '🇩🇿',
  'Sudan': '🇸🇩',
  'Nigeria': '🇳🇬',
  'Ghana': '🇬🇭',
  'Kenya': '🇰🇪',
  'Ethiopia': '🇪🇹',
  'Tanzania': '🇹🇿',
  'Uganda': '🇺🇬',
  'Rwanda': '🇷🇼',
  'Burundi': '🇧🇮',
  'Democratic Republic of Congo': '🇨🇩',
  'Republic of Congo': '🇨🇬',
  'Cameroon': '🇨🇲',
  'Angola': '🇦🇴',
  'Zambia': '🇿🇲',
  'Zimbabwe': '🇿🇼',
  'Botswana': '🇧🇼',
  'Namibia': '🇳🇦',
  'Mozambique': '🇲🇿',
  'Madagascar': '🇲🇬',
  'Mauritius': '🇲🇺',
  'Ivory Coast': '🇨🇮',
  'Senegal': '🇸🇳',
  'Mali': '🇲🇱',
  'Burkina Faso': '🇧🇫',
  'Guinea': '🇬🇳',
  'Sierra Leone': '🇸🇱',
  'Liberia': '🇱🇷',
  'Gabon': '🇬🇦',
  'Eritrea': '🇪🇷',
  'Somalia': '🇸🇴',
  'Djibouti': '🇩🇯',
  'Chad': '🇹🇩',
  'Niger': '🇳🇪',

  // South America
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Chile': '🇨🇱',
  'Bolivia': '🇧🇴',
  'Peru': '🇵🇪',
  'Colombia': '🇨🇴',
  'Venezuela': '🇻🇪',
  'Guyana': '🇬🇾',
  'Suriname': '🇸🇷',
  'French Guiana': '🇬🇫',
  'Uruguay': '🇺🇾',
  'Paraguay': '🇵🇾',
  'Ecuador': '🇪🇨',

  // Oceania
  'Vanuatu': '🇻🇺',
  'New Caledonia': '🇳🇨',
  'Solomon Islands': '🇸🇧',

  // Regional/Generic
  'North America': '🌎',
  'Europe': '🇪🇺',
  'Asia Pacific': '🌏',
  'Middle East': '🕌',
  'Africa': '🌍',
  'South America': '🌎',
  'Oceania': '🏝️',
  'International Waters': '🌊',
  'International': '🌍'
}

const TopEmitters = ({ flights }) => {
  const [category, setCategory] = useState('countries')

  // Comprehensive function to determine country based on coordinates
  const getCountryFromCoordinates = (lat, lng) => {
    if (!lat || !lng) return 'Unknown Country'

    // NORTH AMERICA
    if (lat >= 25 && lat <= 70 && lng >= -170 && lng <= -50) {
      if (lat >= 25 && lat <= 49 && lng >= -125 && lng <= -66) return 'United States'
      if (lat >= 42 && lat <= 70 && lng >= -141 && lng <= -52) return 'Canada'
      if (lat >= 14 && lat <= 33 && lng >= -118 && lng <= -86) return 'Mexico'
      if (lat >= 18 && lat <= 28 && lng >= -88 && lng <= -59) return 'Cuba'
      if (lat >= 17 && lat <= 19 && lng >= -78 && lng <= -76) return 'Jamaica'
      if (lat >= 7 && lat <= 12 && lng >= -85 && lng <= -82) return 'Costa Rica'
      if (lat >= 7 && lat <= 18 && lng >= -92 && lng <= -77) return 'Guatemala'
      return 'North America'
    }

    // EUROPE
    else if (lat >= 35 && lat <= 72 && lng >= -10 && lng <= 40) {
      if (lat >= 49 && lat <= 61 && lng >= -8 && lng <= 2) return 'United Kingdom'
      if (lat >= 47 && lat <= 55 && lng >= 5 && lng <= 15) return 'Germany'
      if (lat >= 42 && lat <= 51 && lng >= -5 && lng <= 8) return 'France'
      if (lat >= 50 && lat <= 54 && lng >= 3 && lng <= 7) return 'Netherlands'
      if (lat >= 36 && lat <= 44 && lng >= -9 && lng <= 4) return 'Spain'
      if (lat >= 36 && lat <= 47 && lng >= 6 && lng <= 19) return 'Italy'
      if (lat >= 46 && lat <= 49 && lng >= 9 && lng <= 17) return 'Austria'
      if (lat >= 45 && lat <= 48 && lng >= 5 && lng <= 11) return 'Switzerland'
      if (lat >= 55 && lat <= 69 && lng >= 10 && lng <= 25) return 'Sweden'
      if (lat >= 58 && lat <= 71 && lng >= 4 && lng <= 31) return 'Norway'
      if (lat >= 59 && lat <= 70 && lng >= 19 && lng <= 32) return 'Finland'
      if (lat >= 54 && lat <= 58 && lng >= 19 && lng <= 29) return 'Poland'
      if (lat >= 48 && lat <= 51 && lng >= 12 && lng <= 23) return 'Czech Republic'
      if (lat >= 47 && lat <= 49 && lng >= 16 && lng <= 22) return 'Hungary'
      if (lat >= 43 && lat <= 47 && lng >= 20 && lng <= 30) return 'Romania'
      if (lat >= 41 && lat <= 44 && lng >= 22 && lng <= 29) return 'Bulgaria'
      if (lat >= 39 && lat <= 42 && lng >= 19 && lng <= 28) return 'Greece'
      if (lat >= 38 && lat <= 42 && lng >= 26 && lng <= 45) return 'Turkey'
      if (lat >= 53 && lat <= 56 && lng >= 20 && lng <= 29) return 'Lithuania'
      if (lat >= 56 && lat <= 58 && lng >= 21 && lng <= 28) return 'Latvia'
      if (lat >= 57 && lat <= 60 && lng >= 21 && lng <= 28) return 'Estonia'
      if (lat >= 53 && lat <= 55 && lng >= 14 && lng <= 24) return 'Belarus'
      if (lat >= 44 && lat <= 53 && lng >= 22 && lng <= 41) return 'Ukraine'
      if (lat >= 41 && lat <= 47 && lng >= 43 && lng <= 47) return 'Georgia'
      if (lat >= 38 && lat <= 42 && lng >= 44 && lng <= 47) return 'Armenia'
      if (lat >= 38 && lat <= 42 && lng >= 44 && lng <= 51) return 'Azerbaijan'
      if (lat >= 35 && lat <= 37 && lng >= 32 && lng <= 35) return 'Cyprus'
      if (lat >= 35 && lat <= 36 && lng >= 14 && lng <= 15) return 'Malta'
      if (lat >= 42 && lat <= 44 && lng >= 17 && lng <= 20) return 'Bosnia and Herzegovina'
      if (lat >= 42 && lat <= 47 && lng >= 13 && lng <= 17) return 'Slovenia'
      if (lat >= 45 && lat <= 47 && lng >= 13 && lng <= 19) return 'Croatia'
      if (lat >= 42 && lat <= 43 && lng >= 18 && lng <= 20) return 'Montenegro'
      if (lat >= 41 && lat <= 43 && lng >= 20 && lng <= 22) return 'Albania'
      if (lat >= 41 && lat <= 42 && lng >= 20 && lng <= 22) return 'North Macedonia'
      if (lat >= 43 && lat <= 45 && lng >= 19 && lng <= 23) return 'Serbia'
      if (lat >= 55 && lat <= 70 && lng >= 20 && lng <= 180) return 'Russia'
      return 'Europe'
    }

    // ASIA PACIFIC
    else if (lat >= -50 && lat <= 55 && lng >= 60 && lng <= 180) {
      if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) return 'China'
      if (lat >= 6 && lat <= 37 && lng >= 68 && lng <= 97) return 'India'
      if (lat >= 30 && lat <= 46 && lng >= 129 && lng <= 146) return 'Japan'
      if (lat >= 33 && lat <= 43 && lng >= 124 && lng <= 132) return 'South Korea'
      if (lat >= 37 && lat <= 43 && lng >= 124 && lng <= 131) return 'North Korea'
      if (lat >= 1 && lat <= 7 && lng >= 103 && lng <= 105) return 'Singapore'
      if (lat >= 1 && lat <= 7 && lng >= 95 && lng <= 142) return 'Indonesia'
      if (lat >= 1 && lat <= 20 && lng >= 99 && lng <= 120) return 'Malaysia'
      if (lat >= 5 && lat <= 21 && lng >= 97 && lng <= 106) return 'Thailand'
      if (lat >= 8 && lat <= 24 && lng >= 102 && lng <= 110) return 'Vietnam'
      if (lat >= 10 && lat <= 24 && lng >= 102 && lng <= 108) return 'Laos'
      if (lat >= 10 && lat <= 15 && lng >= 102 && lng <= 108) return 'Cambodia'
      if (lat >= 9 && lat <= 24 && lng >= 92 && lng <= 102) return 'Myanmar'
      if (lat >= 5 && lat <= 21 && lng >= 118 && lng <= 127) return 'Philippines'
      if (lat >= 22 && lat <= 26 && lng >= 119 && lng <= 122) return 'Taiwan'
      if (lat >= 22 && lat <= 23 && lng >= 113 && lng <= 115) return 'Hong Kong'
      if (lat >= 22 && lat <= 23 && lng >= 113 && lng <= 114) return 'Macau'
      if (lat >= 1 && lat <= 6 && lng >= 95 && lng <= 98) return 'Brunei'
      if (lat >= -44 && lat <= -10 && lng >= 113 && lng <= 154) return 'Australia'
      if (lat >= -47 && lat <= -34 && lng >= 166 && lng <= 179) return 'New Zealand'
      if (lat >= -22 && lat <= -8 && lng >= 140 && lng <= 155) return 'Papua New Guinea'
      if (lat >= -21 && lat <= -12 && lng >= 158 && lng <= 180) return 'Fiji'
      if (lat >= 24 && lat <= 46 && lng >= 84 && lng <= 90) return 'Bangladesh'
      if (lat >= 5 && lat <= 10 && lng >= 79 && lng <= 82) return 'Sri Lanka'
      if (lat >= 26 && lat <= 31 && lng >= 80 && lng <= 89) return 'Nepal'
      if (lat >= 26 && lat <= 29 && lng >= 88 && lng <= 93) return 'Bhutan'
      if (lat >= 35 && lat <= 41 && lng >= 66 && lng <= 75) return 'Afghanistan'
      if (lat >= 23 && lat <= 37 && lng >= 60 && lng <= 78) return 'Pakistan'
      if (lat >= 12 && lat <= 19 && lng >= 42 && lng <= 55) return 'Yemen'
      if (lat >= 16 && lat <= 19 && lng >= 41 && lng <= 44) return 'Saudi Arabia'
      if (lat >= 29 && lat <= 38 && lng >= 44 && lng <= 64) return 'Iran'
      if (lat >= 29 && lat <= 38 && lng >= 38 && lng <= 49) return 'Iraq'
      if (lat >= 36 && lat <= 38 && lng >= 35 && lng <= 43) return 'Syria'
      if (lat >= 33 && lat <= 38 && lng >= 35 && lng <= 37) return 'Lebanon'
      if (lat >= 31 && lat <= 34 && lng >= 34 && lng <= 36) return 'Israel'
      if (lat >= 31 && lat <= 33 && lng >= 34 && lng <= 36) return 'Palestine'
      if (lat >= 29 && lat <= 34 && lng >= 34 && lng <= 40) return 'Jordan'
      if (lat >= 34 && lat <= 43 && lng >= 42 && lng <= 47) return 'Armenia'
      if (lat >= 38 && lat <= 42 && lng >= 44 && lng <= 51) return 'Azerbaijan'
      if (lat >= 36 && lat <= 43 && lng >= 40 && lng <= 47) return 'Georgia'
      if (lat >= 35 && lat <= 43 && lng >= 52 && lng <= 67) return 'Turkmenistan'
      if (lat >= 37 && lat <= 46 && lng >= 55 && lng <= 74) return 'Uzbekistan'
      if (lat >= 36 && lat <= 41 && lng >= 66 && lng <= 75) return 'Tajikistan'
      if (lat >= 39 && lat <= 44 && lng >= 69 && lng <= 81) return 'Kyrgyzstan'
      if (lat >= 40 && lat <= 56 && lng >= 46 && lng <= 88) return 'Kazakhstan'
      if (lat >= 41 && lat <= 46 && lng >= 55 && lng <= 74) return 'Mongolia'
      return 'Asia Pacific'
    }

    // MIDDLE EAST & NORTH AFRICA
    else if (lat >= 10 && lat <= 40 && lng >= 25 && lng <= 60) {
      if (lat >= 22 && lat <= 26 && lng >= 51 && lng <= 56) return 'United Arab Emirates'
      if (lat >= 24 && lat <= 27 && lng >= 50 && lng <= 52) return 'Qatar'
      if (lat >= 25 && lat <= 30 && lng >= 46 && lng <= 49) return 'Kuwait'
      if (lat >= 25 && lat <= 33 && lng >= 36 && lng <= 49) return 'Saudi Arabia'
      if (lat >= 15 && lat <= 19 && lng >= 41 && lng <= 44) return 'Yemen'
      if (lat >= 12 && lat <= 19 && lng >= 42 && lng <= 55) return 'Oman'
      if (lat >= 25 && lat <= 27 && lng >= 50 && lng <= 52) return 'Bahrain'
      if (lat >= 29 && lat <= 38 && lng >= 44 && lng <= 64) return 'Iran'
      if (lat >= 29 && lat <= 38 && lng >= 38 && lng <= 49) return 'Iraq'
      if (lat >= 36 && lat <= 42 && lng >= 26 && lng <= 45) return 'Turkey'
      if (lat >= 22 && lat <= 32 && lng >= 24 && lng <= 37) return 'Egypt'
      if (lat >= 19 && lat <= 24 && lng >= 15 && lng <= 25) return 'Libya'
      if (lat >= 30 && lat <= 38 && lng >= -17 && lng <= -1) return 'Morocco'
      if (lat >= 30 && lat <= 38 && lng >= 7 && lng <= 12) return 'Tunisia'
      if (lat >= 18 && lat <= 38 && lng >= -9 && lng <= 12) return 'Algeria'
      if (lat >= 15 && lat <= 23 && lng >= 15 && lng <= 24) return 'Sudan'
      return 'Middle East'
    }

    // AFRICA
    else if (lat >= -35 && lat <= 35 && lng >= -20 && lng <= 50) {
      if (lat >= -35 && lat <= -22 && lng >= 16 && lng <= 33) return 'South Africa'
      if (lat >= -26 && lat <= -17 && lng >= 20 && lng <= 30) return 'Botswana'
      if (lat >= -23 && lat <= -16 && lng >= 11 && lng <= 26) return 'Namibia'
      if (lat >= -30 && lat <= -15 && lng >= 25 && lng <= 36) return 'Zimbabwe'
      if (lat >= -26 && lat <= -15 && lng >= 31 && lng <= 36) return 'Mozambique'
      if (lat >= -15 && lat <= -8 && lng >= 23 && lng <= 31) return 'Zambia'
      if (lat >= -18 && lat <= -9 && lng >= 11 && lng <= 25) return 'Angola'
      if (lat >= -13 && lat <= -4 && lng >= 11 && lng <= 19) return 'Democratic Republic of Congo'
      if (lat >= -5 && lat <= 5 && lng >= 8 && lng <= 19) return 'Cameroon'
      if (lat >= 3 && lat <= 15 && lng >= 7 && lng <= 15) return 'Nigeria'
      if (lat >= 4 && lat <= 12 && lng >= -15 && lng <= -7) return 'Ghana'
      if (lat >= 6 && lat <= 15 && lng >= -17 && lng <= -10) return 'Ivory Coast'
      if (lat >= 12 && lat <= 17 && lng >= -17 && lng <= -11) return 'Senegal'
      if (lat >= 9 && lat <= 15 && lng >= -15 && lng <= -4) return 'Mali'
      if (lat >= 9 && lat <= 15 && lng >= -6 && lng <= 3) return 'Burkina Faso'
      if (lat >= 5 && lat <= 12 && lng >= -12 && lng <= -7) return 'Guinea'
      if (lat >= 6 && lat <= 11 && lng >= -12 && lng <= -7) return 'Sierra Leone'
      if (lat >= 4 && lat <= 9 && lng >= -12 && lng <= -7) return 'Liberia'
      if (lat >= -1 && lat <= 4 && lng >= 8 && lng <= 16) return 'Gabon'
      if (lat >= -1 && lat <= 4 && lng >= 11 && lng <= 19) return 'Republic of Congo'
      if (lat >= 0 && lat <= 4 && lng >= 32 && lng <= 36) return 'Uganda'
      if (lat >= -4 && lat <= 1 && lng >= 28 && lng <= 31) return 'Rwanda'
      if (lat >= -5 && lat <= -2 && lng >= 28 && lng <= 31) return 'Burundi'
      if (lat >= -12 && lat <= -1 && lng >= 29 && lng <= 41) return 'Tanzania'
      if (lat >= -1 && lat <= 5 && lng >= 33 && lng <= 42) return 'Kenya'
      if (lat >= 3 && lat <= 15 && lng >= 32 && lng <= 49) return 'Ethiopia'
      if (lat >= 12 && lat <= 18 && lng >= 36 && lng <= 43) return 'Eritrea'
      if (lat >= 8 && lat <= 12 && lng >= 42 && lng <= 49) return 'Somalia'
      if (lat >= 8 && lat <= 12 && lng >= 42 && lng <= 49) return 'Djibouti'
      if (lat >= 30 && lat <= 38 && lng >= -17 && lng <= -1) return 'Morocco'
      if (lat >= 30 && lat <= 38 && lng >= 7 && lng <= 12) return 'Tunisia'
      if (lat >= 18 && lat <= 38 && lng >= -9 && lng <= 12) return 'Algeria'
      if (lat >= 22 && lat <= 32 && lng >= 24 && lng <= 37) return 'Egypt'
      if (lat >= 19 && lat <= 24 && lng >= 15 && lng <= 25) return 'Libya'
      if (lat >= 15 && lat <= 23 && lng >= 15 && lng <= 24) return 'Sudan'
      if (lat >= 8 && lat <= 17 && lng >= 20 && lng <= 28) return 'Chad'
      if (lat >= 8 && lat <= 24 && lng >= 13 && lng <= 24) return 'Niger'
      if (lat >= -30 && lat <= -20 && lng >= -58 && lng <= -47) return 'Madagascar'
      if (lat >= -21 && lat <= -19 && lng >= 55 && lng <= 58) return 'Mauritius'
      return 'Africa'
    }

    // SOUTH AMERICA
    else if (lat >= -60 && lat <= 15 && lng >= -85 && lng <= -35) {
      if (lat >= -56 && lat <= 5 && lng >= -74 && lng <= -34) return 'Brazil'
      if (lat >= -55 && lat <= -21 && lng >= -73 && lng <= -53) return 'Argentina'
      if (lat >= -56 && lat <= -17 && lng >= -76 && lng <= -66) return 'Chile'
      if (lat >= -23 && lat <= -9 && lng >= -70 && lng <= -57) return 'Bolivia'
      if (lat >= -18 && lat <= -2 && lng >= -82 && lng <= -68) return 'Peru'
      if (lat >= -5 && lat <= 13 && lng >= -82 && lng <= -66) return 'Colombia'
      if (lat >= 1 && lat <= 13 && lng >= -74 && lng <= -59) return 'Venezuela'
      if (lat >= 1 && lat <= 9 && lng >= -62 && lng <= -56) return 'Guyana'
      if (lat >= 1 && lat <= 6 && lng >= -59 && lng <= -53) return 'Suriname'
      if (lat >= 2 && lat <= 6 && lng >= -55 && lng <= -51) return 'French Guiana'
      if (lat >= -35 && lat <= -30 && lng >= -58 && lng <= -53) return 'Uruguay'
      if (lat >= -28 && lat <= -19 && lng >= -63 && lng <= -54) return 'Paraguay'
      if (lat >= -18 && lat <= 12 && lng >= -70 && lng <= -59) return 'Ecuador'
      return 'South America'
    }

    // OCEANIA
    else if (lat >= -50 && lat <= 0 && lng >= 110 && lng <= 180) {
      if (lat >= -44 && lat <= -10 && lng >= 113 && lng <= 154) return 'Australia'
      if (lat >= -47 && lat <= -34 && lng >= 166 && lng <= 179) return 'New Zealand'
      if (lat >= -22 && lat <= -8 && lng >= 140 && lng <= 155) return 'Papua New Guinea'
      if (lat >= -21 && lat <= -12 && lng >= 158 && lng <= 180) return 'Fiji'
      if (lat >= -25 && lat <= -15 && lng >= 166 && lng <= 171) return 'Vanuatu'
      if (lat >= -23 && lat <= -18 && lng >= 162 && lng <= 168) return 'New Caledonia'
      if (lat >= -15 && lat <= -8 && lng >= 155 && lng <= 162) return 'Solomon Islands'
      return 'Oceania'
    }

    return 'International Waters'
  }

  // Calculate top emitters by different categories
  const calculateTopEmitters = (flights, category) => {
    const emitters = {}

    flights.forEach(flight => {
      let key
      switch (category) {
        case 'airlines':
          key = flight.airline || 'Unknown Airline'
          break
        case 'aircraft':
          key = flight.aircraft || 'Unknown Aircraft'
          break
        case 'routes':
          key = `${flight.origin || 'Unknown'} → ${flight.destination || 'Unknown'}`
          break
        case 'countries':
          // Try origin_country first, then fallback to coordinates
          key = flight.origin_country || getCountryFromCoordinates(flight.latitude, flight.longitude)
          break
        default:
          key = 'Unknown'
      }

      if (!emitters[key]) {
        emitters[key] = {
          name: key,
          totalEmissions: 0,
          flightCount: 0,
          averageEmissions: 0
        }
      }

      emitters[key].totalEmissions += flight.emissions?.co2 || 0
      emitters[key].flightCount += 1
    })

    // Calculate averages and sort
    Object.values(emitters).forEach(emitter => {
      emitter.averageEmissions = emitter.totalEmissions / emitter.flightCount
    })

    return Object.values(emitters)
      .sort((a, b) => b.totalEmissions - a.totalEmissions)
      // Show all countries - no limit since we have comprehensive global data
  }

  const topEmitters = calculateTopEmitters(flights, category)
  const maxEmissions = topEmitters[0]?.totalEmissions || 1

  const categories = [
    { value: 'airlines', label: 'Airlines', icon: Building2 },
    { value: 'aircraft', label: 'Aircraft', icon: Plane },
    { value: 'routes', label: 'Routes', icon: MapPin },
    { value: 'countries', label: 'Countries', icon: MapPin }
  ]

  const getEmissionColor = (emissions, max) => {
    const percentage = emissions / max
    if (percentage > 0.8) return 'bg-red-500'
    if (percentage > 0.6) return 'bg-orange-500'
    if (percentage > 0.4) return 'bg-yellow-500'
    if (percentage > 0.2) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Emitters
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Highest CO₂ emissions by category
            </p>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Top Emitters List */}
      <div className="space-y-3">
        {topEmitters.map((emitter, index) => (
          <motion.div
            key={emitter.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Rank */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              index === 2 ? 'bg-orange-600' :
              'bg-gray-500'
            }`}>
              {index + 1}
            </div>

            {/* Name and Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {category === 'countries' && (
                    <span className="text-lg">
                      {countryFlags[emitter.name] || '🌍'}
                    </span>
                  )}
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {emitter.name}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {emitter.flightCount} flights
                  </span>
                </div>
              </div>
              
              {/* Emissions Bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {emitter.totalEmissions.toFixed(1)} tons CO₂
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {emitter.averageEmissions.toFixed(1)} avg
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(emitter.totalEmissions / maxEmissions) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${getEmissionColor(emitter.totalEmissions, maxEmissions)}`}
                  />
                </div>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                +{(Math.random() * 10).toFixed(1)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {topEmitters.reduce((sum, e) => sum + e.totalEmissions, 0).toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total CO₂ (tons)
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {topEmitters.reduce((sum, e) => sum + e.flightCount, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Flights
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get emission color based on intensity
const getEmissionColor = (emissions, maxEmissions) => {
  const percentage = (emissions / maxEmissions) * 100
  if (percentage >= 80) return 'bg-red-500'
  if (percentage >= 60) return 'bg-orange-500'
  if (percentage >= 40) return 'bg-yellow-500'
  if (percentage >= 20) return 'bg-blue-500'
  return 'bg-green-500'
}

export default TopEmitters
