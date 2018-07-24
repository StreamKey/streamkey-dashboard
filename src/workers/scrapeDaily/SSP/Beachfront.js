import qs from 'querystring'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_BEACHFRONT_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_BEACHFRONT_PASSWORD
}

// Yesterday Report
const REPORT_ID = process.env.RAZZLE_CREDENTIALS_BEACHFRONT_REPORT_ID

axios.defaults.baseURL = 'https://platform.beachfront.io'

const login = async () => {
  const form = {
    username: credentials.username,
    password: credentials.password,
    remember_me: 'on'
  }
  try {
    await axios.post('/en/login', qs.stringify(form))
  } catch (e) {
    e.prevError = e.message
    e.message = 'Beachfront login failed'
    throw e
  }
}

const getResults = async dateTs => {
  try {
    const res = await axios.get(`/restful/users/reports/report/${REPORT_ID}`)
    return res.data.data.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Beachfront report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.inventoryname,
      opp: r.requests,
      imp: r.impressions,
      rev: r.revenue,
      sCost: (r.requests - r.impressions) * 0.0000015
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
