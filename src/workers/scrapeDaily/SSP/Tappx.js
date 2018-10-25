import moment from 'moment'
import axios from 'axios'

const credentials = {
  userId: process.env.RAZZLE_CREDENTIALS_TAPPX_USERID,
  apiKey: process.env.RAZZLE_CREDENTIALS_TAPPX_APIKEY
}

const baseURL = 'http://reporting.api.tappx.com/ssp/v3'

const getResults = async dateTs => {
  try {
    const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
    const params = {
      key: credentials.apiKey,
      id: credentials.userId,
      date_start: date,
      date_end: date,
      currency: 'USD'
    }
    const res = await axios.get(baseURL, { params })
    const data = res.data.split('\n').map(line => line.split(';'))
    return data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Tappx report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r[1], // TappxID. Should be app name
      opp: r[6],
      imp: r[8],
      rev: r[10],
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
