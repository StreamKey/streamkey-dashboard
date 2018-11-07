import moment from 'moment'
import axios from 'axios'
import qs from 'querystring'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axiosInstance = GenerateAxiosCookies()

const credentials = {
  userId: process.env.RAZZLE_CREDENTIALS_TAPPX_USERID,
  apiKey: process.env.RAZZLE_CREDENTIALS_TAPPX_APIKEY,
  username: process.env.RAZZLE_CREDENTIALS_TAPPX_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_TAPPX_PASSWORD
}

const apiBaseURL = 'http://reporting.api.tappx.com/ssp/v3'
const webBaseURL = 'https://www.tappx.com/en/admin'

const login = async () => {
  const form = {
    username: credentials.username,
    password: credentials.password
  }
  try {
    await axiosInstance.post(webBaseURL + '/login/', qs.stringify(form))
  } catch (e) {
    e.prevError = e.message
    e.message = 'Tappx login failed'
    throw e
  }
}

const getApps = async () => {
  try {
    const res = await axiosInstance.get(webBaseURL + '/api/reports/userdata/?type=monetize')
    const apps = res.data['filter'].filter(i => i.id === 'app')[0].childs
    const appDict = {}
    for (let a of apps) {
      appDict[a.id] = a.name.replace(/^\d+\s*-\s*/, '')
    }
    return appDict
  } catch (e) {
    e.prevError = e.message
    e.message = 'Tappx get apps failed'
    throw e
  }
}

const getResults = async dateTs => {
  try {
    const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
    const params = {
      key: credentials.apiKey,
      id: credentials.userId,
      date_start: date,
      date_end: date,
      currency: 'USD'
    }
    const res = await axios.get(apiBaseURL, { params })
    const data = res.data.replace(/[\n\r\s]*$/, '').split('\n').map(line => line.split(';'))
    return data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Tappx report failed'
    throw e
  }
}

const normalize = (results, apps) => {
  return results.map(r => {
    const appName = apps[r[1]] || 'Unknown Tappx app: ' + r[1]
    return {
      tag: appName,
      opp: Number(r[6]),
      imp: Number(r[8]),
      rev: Number(r[10]),
      sCost: 0
    }
  })
}

export default {
  getData: async dateTs => {
    await login()
    const apps = await getApps()
    const results = await getResults(dateTs)
    return normalize(results, apps)
  }
}
