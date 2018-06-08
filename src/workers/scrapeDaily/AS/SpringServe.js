import moment from 'moment'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_SPRINGSERVE_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_SPRINGSERVE_PASSWORD
}

axios.defaults.baseURL = 'https://video.springserve.com'
let authHeader

const login = async () => {
  const form = {
    email: credentials.username,
    password: credentials.password
  }
  try {
    const res = await axios.post('/api/v0/auth', form)
    authHeader = res.data.token
  } catch (e) {
    e.prevError = e.message
    e.message = 'SpringServe login failed'
    throw e
  }
}

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    date_range: 'Last 7 Days',
    start_date: date,
    end_date: date,
    interval: 'day',
    timezone: 'UTC',
    dimensions: [
      // 'supply_tag_id',
      'demand_tag_id'
    ]
  }
  try {
    const res = await axios.post('/api/v0/report', form, {
      headers: {
        'Authorization': authHeader
      }
    })
    return res.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'SpringServe report failed'
    throw e
  }
}

const normalize = (results, dateTs) => {
  const dateToMatch = moment(dateTs).format('YYYY-MM-DD ')
  return results.filter(r => {
    return r.date.startsWith(dateToMatch)
  }).map(r => {
    return {
      tag: r.demand_tag_name,
      asOpp: r.opportunities,
      asImp: r.impressions,
      asRev: r.revenue,
      asCost: 0,
      asScost: (r.impressions / 1000) * 0.2
    }
  })
}

export default {
  getData: async dateTs => {
    try {
      await login()
      const results = await getResults(dateTs)
      return normalize(results, dateTs)
    } catch (e) {
      throw e
    }
  }
}
