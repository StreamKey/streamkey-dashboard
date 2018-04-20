import moment from 'moment'

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
    console.error(e)
    throw new Error('Telaria login failed', e)
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
      'sspNetRevenue',
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
  return res.data.code
}

const waitUntilResultsReady = async queryId => {
  let resultsReady = false
  let retries = TIMEOUT
  while (!resultsReady) {
    await waitAsync(1000)
    const res = await axios.get(`/queries/${queryId}`)
    if (res.data.error) {
      console.error(res)
      throw new Error('Telaria error', res.data.error)
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
    let revenue = r.sspNetRevenue
    if (r.currency !== 'USD') {
      if (currencies[r.currency]) {
        revenue = r.sspNetRevenue * currencies[r.currency]
      } else {
        console.error('Unknown revenue currency', r)
      }
    }
    return {
      tag: r.adUnit,
      opp: r.requests,
      imp: r.impressions,
      rev: r.sspNetRevenue,
      cpm: r.netCpm
    }
  })
}

export default {
  getData: async dateTs => {
    await login()
    const queryId = await submitQuery(dateTs)
    const currencies = await getCurrencies()
    await waitUntilResultsReady(queryId)
    const results = await getResults(queryId)
    return normalize(results, currencies)
  }
}
