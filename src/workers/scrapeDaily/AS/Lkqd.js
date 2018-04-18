import moment from 'moment'
import axios from 'axios'

const credentials = {
  key: process.env.RAZZLE_CREDENTIALS_LKQD_APIKEY,
  secret: process.env.RAZZLE_CREDENTIALS_LKQD_APISECRET
}

const toBase64 = str => {
  return Buffer.from(str).toString('base64')
}

const authStr = `${credentials.key}:${credentials.secret}`
axios.defaults.headers.common['Authorization'] = `Basic ${toBase64(authStr)}`
axios.defaults.baseURL = 'https://api.lkqd.com'

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
      'OPPORTUNITIES',
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
      opp: r.adImpressions,
      imp: r.adCompletedViews,
      rev: r.revenue,
      cpm: r.cpm
    }
  })
}

export default {
  getData: async dateTs => {
    const results = await getResults(dateTs)
    return normalize(results)
  }
}
