import moment from 'moment'
import Axios from 'axios'

const credentials = {
  key: process.env.RAZZLE_CREDENTIALS_LKQD_APIKEY,
  secret: process.env.RAZZLE_CREDENTIALS_LKQD_APISECRET
}

const toBase64 = str => {
  return Buffer.from(str).toString('base64')
}

const authStr = `${credentials.key}:${credentials.secret}`
const axios = Axios.create({
  baseURL: 'https://api.lkqd.com',
  headers: {
    'Authorization': `Basic ${toBase64(authStr)}`
  }
})

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    timeDimension: 'DAILY',
    reportType: ['TAG'],
    reportFormat: 'JSON',
    startDate: date,
    endDate: date,
    timezone: 'UTC',
    metrics: [
      'IMPRESSIONS',
      'REQUESTS',
      'FILL_RATE',
      'CPM',
      'REVENUE',
      'COST'
    ]
  }
  try {
    const res = await axios.post('/reports', form)
    return res.data.data.entries
  } catch (e) {
    console.error(e)
    throw new Error('Lkqd report failed', e)
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.fieldName,
      asOpp: r.adRequests,
      asImp: r.adImpressions,
      asRev: r.revenue,
      asCost: r.siteCost,
      asScost: (r.adImpressions / 1000) * 0.24
    }
  })
}

export default {
  getData: async dateTs => {
    const results = await getResults(dateTs)
    return normalize(results)
  }
}
