import moment from 'moment'
import winston from 'winston'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_TELARIA_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_TELARIA_PASSWORD
}

const TIMEOUT = process.env.RAZZLE_CREDENTIALS_TELARIA_TIMEOUT

axios.defaults.baseURL = 'https://console.telaria.com/platform/resources'

const waitAsync = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const login = async () => {
  try {
    await axios.post('/sessions', {
      emailAddress: credentials.username,
      password: credentials.password
    })
  } catch (e) {
    e.prevError = e.message
    e.message = 'Telaria login failed'
    throw e
  }
}

const getCurrencies = async () => {
  const currencies = {}
  const res = await axios.get(`/currencies/conversions`)
  res.data.map(c => {
    if (c.targetCurrencyCode === 'USD') {
      currencies[c.sourceCurrencyCode] = c.rate
    }
  })
  return currencies
}

const submitQuery = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    source: 'adstats-publisher',
    fields: [
      'adUnit',
      'requests',
      'impressions',
      'netRevenue',
      'sspNetRevenue', // Programmatic Net Revenue
      'currency',
      'netCpm'
    ],
    filters: [],
    constraints: [],
    orderings: [],
    range: {
      fromDate: date,
      toDate: date,
      timeZone: 'UTC'
    },
    conversions: [{
      // Convert to USD
      field: 'currency',
      value: 1
    }],
    parent: {
      field: 'seat',
      value: 60749
    }
  }
  const res = await axios.post(`/queries`, form)
  winston.info('Telaria query ID', {
    queryId: res.data.code
  })
  return res.data.code
}

const waitUntilResultsReady = async queryId => {
  let resultsReady = false
  let retries = TIMEOUT
  let errorRetries = 3
  while (!resultsReady) {
    await waitAsync(1000)
    const res = await axios.get(`/queries/${queryId}`)
    if (res.data.error) {
      if (errorRetries > 0) {
        errorRetries--
        winston.warn('Telaria retry error', {
          retriesLeft: errorRetries
        })
        await waitAsync(3000)
        continue
      } else {
        const e = new Error('Telaria error')
        e.prevError = res.data.error
        e.message = 'Telaria error'
        throw e
      }
    }
    resultsReady = res.data.status === 3
    retries--
    if (retries < 0) {
      throw new Error('Telaria timeout')
    }
  }
}

const getResults = async queryId => {
  const res = await axios.get(`/queries/${queryId}/results`)
  return res.data
}

const normalize = (results, currencies) => {
  return results.map(r => {
    let revenue = Math.max(r.sspNetRevenue, r.netRevenue)
    if (r.currency !== 'USD') {
      if (currencies[r.currency]) {
        revenue = (Math.max(r.sspNetRevenue, r.netRevenue)) * currencies[r.currency]
      } else {
        winston.error('Telaria Unknown revenue currency', { result: r })
      }
    }
    return {
      tag: r.adUnit,
      opp: r.requests,
      imp: r.impressions,
      rev: revenue,
      sCost: 0
    }
  })
}

export default {
  getData: async dateTs => {
    try {
      await login()
      const queryId = await submitQuery(dateTs)
      const currencies = await getCurrencies()
      await waitUntilResultsReady(queryId)
      const results = await getResults(queryId)
      return normalize(results, currencies)
    } catch (e) {
      throw e
    }
  }
}
