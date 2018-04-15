import moment from 'moment'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies({ returnJar: true })

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_SPOTX_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_SPOTX_PASSWORD,
  publisherId: process.env.RAZZLE_CREDENTIALS_SPOTX_PUBLISHERID
}

axios.axios.defaults.baseURL = 'https://publisher-api.spotxchange.com/1.0'
// TODO use the OAuth authentication
// https://developer.spotxchange.com/content/local/docs/apiDocs/platform/reporting.md

const login = async () => {
  const form = {
    username: credentials.username,
    password: credentials.password
  }
  try {
    await axios.axios.post('/Publisher/Login', form)
  } catch (e) {
    console.error(e)
    throw new Error('SpotX login failed', e)
  }
}

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    date_range: `${date} | ${date}`
  }
  try {
    const res = await axios.axios.get(`/Publisher(${credentials.publisherId})/Channels/RevenueReport`, { params: form })
    return res.data.value.data
  } catch (e) {
    console.error(e)
    throw new Error('SpotX report failed', e)
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.channel_name,
      opp: Number(r.queries),
      imp: Number(r.impressions),
      rev: Number(r.revenue_usd),
      cpm: Number(r.cpm_usd)
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
