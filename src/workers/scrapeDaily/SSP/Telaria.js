import '../../../../env'
import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_TELARIA_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_TELARIA_PASSWORD
}

axios.defaults.baseURL = 'https://console.telaria.com/platform/resources'

const login = async () => {
  await axios.post('/sessions', {
    emailAddress: credentials.username,
    password: credentials.password
  })
}

const submitQuery = async dateTs => {
  /*
  POST /queries
  {
    "source":"adstats-publisher",
    "fields":["day","adUnit","requests","impressions","fillRate","sspNetRevenue","currency","netCpm"],
    "filters":[],
    "constraints":[],
    "orderings":[],
    "range":{"fromDate":"2018-04-04","toDate":"2018-04-04","timeZone":"UTC"},
    "conversions":null,
    "parent":{"field":"seat","value":60749}}

  Result:
  {
    "code" : "hf8oikq0k",
    "status" : 2,
    "startTime" : "2018-04-05T11:26:45.724+0000",
    "error" : null
  }
  */
 return 'hf8oikq0k'
}

const waitUntilResultsReady = async queryId => {
  const res = await axios.get(`/queries/${queryId}`)
  // console.log('status', res.data.status === 3)
}

const getResults = async queryId => {
  const res = await axios.get(`/queries/${queryId}/results`)
  return res.data
}

const normalize = results => {
  return results.map(r => {
    if (r.currency !== 'USD') {
      console.error('SSP revenue not in USD', r)
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
    await waitUntilResultsReady(queryId)
    const results = await getResults(queryId)
    return normalize(results)
  }
}
