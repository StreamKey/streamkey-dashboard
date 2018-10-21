// WIP
// https://streamkey.peak226.com/v1/report/performance?fields=peak_static.dimdate_gmt.date_string&fields=peak_static.advertisers.name&fields=advertiser_id&fields=adv_network_cost&fields=advertiser_network_revenue&fields=profit&fields=impressions&dateRange=2018-10-16-2018-10-16

import qs from 'querystring'
import moment from 'moment'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_PEAK_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_PEAK_PASSWORD
}

axios.defaults.baseURL = 'https://streamkey.peak226.com'

const login = async () => {
  const form = {
    email: credentials.username,
    password: credentials.password
  }
  try {
    await axios.post('/auth', JSON.stringify(form))
  } catch (e) {
    e.prevError = e.message
    e.message = 'Peak login failed'
    throw e
  }
}

const getResults = async dateTs => {
  try {
    const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
    const params = {
      fields: [
        'peak_static.dimdate_gmt.date_string',
        'peak_static.campaigns.title',
        'line_item_id',
        'placement_id',
        'adv_network_cost',
        'advertiser_network_revenue',
        'profit',
        'impressions',
        'views'
      ],
      dateRange: `${date}-${date}`
    }
    const res = await axios.get('/v1/report/performance?' + qs.stringify(params))
    const data = res.data.data
    data.shift()
    return data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Peak report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r[1],
      opp: r[8],
      imp: r[7],
      rev: r[5],
      sCost: 0
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
