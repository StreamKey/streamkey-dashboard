import moment from 'moment'
import qs from 'querystring'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_FREEWHEEL_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_FREEWHEEL_PASSWORD
}

axios.defaults.baseURL = 'https://sfx.freewheel.tv'

const login = async () => {
  const form = {
    username: credentials.username,
    password: credentials.password
  }
  try {
    await axios.post('/auth/ajax-login', qs.stringify(form))
  } catch (e) {
    console.error(e)
    throw new Error('Freewheel login failed', e)
  }
}

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('DD MMMM YYYY')
  const form = {
    start: date,
    end: date,
    group: ['zone']
  }
  const res = await axios.post('/advanced-stats/ajax-get-stats', qs.stringify(form))
  return res.data.datatable.results
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.zone_name,
      opp: r.request,
      imp: r.impression,
      rev: r.revenue,
      sCost: 0 // TODO
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
