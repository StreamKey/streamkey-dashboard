import Axios from 'axios'
import querystring from 'querystring'

const credentials = {
  key: process.env.RAZZLE_CREDENTIALS_CEDATO_APIKEY,
  secret: process.env.RAZZLE_CREDENTIALS_CEDATO_APISECRET
}

const toBase64 = str => {
  return Buffer.from(str).toString('base64')
}

const authStr = `${credentials.key}:${credentials.secret}`
const axios = Axios.create({
  baseURL: 'https://api.cedato.com/api',
})

const getResults = async dateTs => {
  const form = {
    "dimensions": [
      "demand",
      "supply",
      "day"
    ],
    "range": "yesterday",
    "measures": ["ad requests", "impressions", "revenue", "impression rpm", "demand fr"]
  }
  try {
    const tokenRes = await axios.post(
      '/token',
      querystring.stringify({ 'grant_type': 'client_credentials' }),
      {
        headers: {
          'Authorization': `Basic ${toBase64(authStr)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    const token = tokenRes.data.data.access_token
    const reportRes = await axios.post(
      '/v2.0/reports/',
      form,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    const reportUrl = reportRes.data.data
    const report = await axios.get(reportUrl)
    return report.data.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Cedato report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r[4],
      asOpp: r[6],
      asImp: r[7],
      asRev: r[8],
      asCost: 0,
      asScost: (r[7] / 1000) * 0.2
    }
  })
}

export default {
  getData: async dateTs => {
    try {
      const results = await getResults(dateTs)
      return normalize(results)
    } catch (e) {
      throw e
    }
  }
}
