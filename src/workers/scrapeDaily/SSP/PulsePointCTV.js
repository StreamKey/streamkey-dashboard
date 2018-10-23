import axios from 'axios'
import moment from 'moment'

const reportsUrl = 'https://openapi.pulsepoint.com/OpenAPIPublisher/v1.0/reporting/accountmanagement'

const {
  RAZZLE_CREDENTIALS_PULSEPOINTCTV_API_TOKEN
} = process.env

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    token: RAZZLE_CREDENTIALS_PULSEPOINTCTV_API_TOKEN,
    fromDate: date,
    toDate: date
  }
  try {
    const res = await axios.get(reportsUrl, {
      params: form
    })
    return res.data.reportData
  } catch (e) {
    e.prevError = e.message
    e.message = 'PulsePointCTV report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.tagName,
      opp: 0,
      imp: Number(r.totalImpressions),
      rev: Number(r.netRevenue),
      sCost: 0
    }
  })
}

export default {
  getData: async dateTs => {
    const results = await getResults(dateTs)
    return normalize(results)
  }
}
