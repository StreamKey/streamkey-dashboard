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
    console.error(e)
    throw new Error('SpringServe login failed', e)
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
    return res.data
  } catch (e) {
    console.error(e)
    throw new Error('SpringServe report failed', e)
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.demand_tag_name,
      opp: r.opportunities,
      imp: r.impressions,
      rev: r.revenue,
      cost: 0, // TODO
      cpm: r.cpm
    }
  })
}

export default {
  getData: async dateTs => {
    await login()
    const results = await getResults(dateTs)
    return normalize(results)
  }
}
