import moment from 'moment'
import qs from 'querystring'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_STREAMRAIL_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_STREAMRAIL_PASSWORD
}

axios.defaults.baseURL = 'https://partners.streamrail.com/api'

const login = async () => {
  const form = {
    grant_type: 'password',
    username: credentials.username,
    password: credentials.password
  }
  try {
    await axios.post('/v2/login', qs.stringify(form))
  } catch (e) {
    console.error(e)
    throw new Error('StreamRail login failed', e)
  }
}

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const startDate = `${date}T00:00:00+00:00`
  const endDate = `${date}T23:59:59+00:00`

  const params = {
    rangeType: 'yesterday',
    startDate,
    endDate,
    itemsPerPage: 1000,
    page: 1,
    sortBy: 'demandRevenues',
    sortAsc: false,
    timeZone: 'Etc/UTC',
    reportToFetch: 'demand',
    ramp: 3527
  }

  // TODO get all pages

  const res = await axios.get('/report/demand', { params })
  if (res.data.data.length !== res.data.meta.total) {
    throw new Error('StreamRail mismatch number of results')
  }
  return res.data.data
}

const normalize = results => {
  return results.map(r => ({
    tag: r.adSource,
    opp: r.opportunities,
    imp: r.impressions,
    rev: r.demandRevenues,
    cost: 0, // TODO
    sCost: 0 // TODO
  }))
}

export default {
  getData: async dateTs => {
    await login()
    const results = await getResults(dateTs)
    return normalize(results)
  }
}
