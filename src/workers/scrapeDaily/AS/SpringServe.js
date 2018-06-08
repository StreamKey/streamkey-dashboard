import moment from 'moment'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_SPRINGSERVE_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_SPRINGSERVE_PASSWORD
}

axios.defaults.baseURL = 'https://video.springserve.com'

const login = async () => {
  const form = {
    email: credentials.username,
    password: credentials.password
  }
  try {
    const res = await axios.post('/api/v0/auth', form)
    axios.defaults.headers.common['Authorization'] = res.data.token
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
    const res = await axios.post('/api/v0/report', form)
    console.log(JSON.stringify(res.data, null, 2))
    return res.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'SpringServe report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.demand_tag_name,
      asOpp: r.opportunities,
      asImp: r.impressions,
      asRev: r.revenue,
      asCost: 0, // TODO
      asScost: (r.impressions / 1000) * 0.2
    }
  })
}

export default {
  getData: async dateTs => {
    try {
      await login()
      const results = await getResults(dateTs)
      return normalize(results)
    } catch (e) {
      throw e
    }
  }
}
