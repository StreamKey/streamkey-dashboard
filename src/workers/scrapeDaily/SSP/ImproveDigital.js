import moment from 'moment'
import qs from 'querystring'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_IMPROVEDIGITAL_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_IMPROVEDIGITAL_PASSWORD
}

axios.defaults.baseURL = 'https://360yield.com'

const login = async () => {
  const form = {
    'login[_username]': credentials.username,
    'login[_password]': credentials.password,
    'login[locale]': 'en',
    'login[g-recaptcha-response]': ''
  }
  try {
    await axios.post('/login_check', qs.stringify(form))
  } catch (e) {
    console.error(e)
    e.prevError = e.message
    e.message = 'ImproveDigital login failed'
    throw e
  }
}

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    type: 'total',
    timeframe: '2',
    custom_from_date: date,
    custom_to_date: date,
    buying_type_id: '',
    dimension: 'site',
    metric_a: 'paid_impressions',
    metric_b: 'revenue',
    priority: 'paid_impressions',
    currency: 'USD'
  }
  try {
    const res = await axios.post('/reports/get360ChartConfig', qs.stringify(form))
    return res.data.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'ImproveDigital getResults failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.site,
      opp: 0,
      imp: Number(r.paid_impressions),
      rev: Number(r.revenue) * 0.7,
      sCost: 0
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
