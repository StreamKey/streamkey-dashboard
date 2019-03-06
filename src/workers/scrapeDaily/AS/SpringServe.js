import moment from 'moment'
import winston from 'winston'

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

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
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
      'demand_tag_id'
    ]
  }
  const MAX_RETRIES = 30
  let i
  for (i = 0; i <= MAX_RETRIES; ++i) {
    try {
      const res = await axios.post('/api/v0/report', form, {
        headers: {
          'Authorization': authHeader
        }
      })
      if (i > 0) {
        winston.warn(`SpringServe succeeded on ${i + 1} retry`)
      }
      return res.data
    } catch (e) {
      if (i === MAX_RETRIES) {
        e.prevError = e.message
        e.message = 'SpringServe report failed'
        winston.error(`SpringServe failed after ${MAX_RETRIES} retries`)
        throw e
      }
      await sleep(5000)
    }
  }
}

const normalize = (results, dateTs) => {
  const dateToMatch = moment(dateTs).format('YYYY-MM-DD ')
  return results.filter(r => {
    return r.date.startsWith(dateToMatch)
  }).map(r => {
    return {
      tag: r.demand_tag_name,
      asOpp: r.demand_requests,
      asImp: r.impressions,
      asRev: r.revenue,
      asCost: r.cost,
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
