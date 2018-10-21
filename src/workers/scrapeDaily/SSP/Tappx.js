// WIP

// https://www.tappx.com/en/admin/login/
// username: ...
// password: ...

// https://www.tappx.com/en/admin/reports/?timerange=selecteddates&dp1=2018-10-20&dp2=2018-10-20&csv=1

import qs from 'querystring'
import moment from 'moment'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_TAPPX_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_TAPPX_PASSWORD
}

axios.defaults.baseURL = 'https://www.tappx.com/en/admin'

const login = async () => {
  const form = {
    username: credentials.username,
    password: credentials.password
  }
  try {
    await axios.post('/login', qs.stringify(form))
  } catch (e) {
    e.prevError = e.message
    e.message = 'Tappx login failed'
    throw e
  }
}

const getResults = async dateTs => {
  try {
    const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
    const params = {
      timerange: 'selecteddates',
      dp1: date,
      dp2: date,
      csv: '1'
    }
    const res = await axios.get('/reports/?' + qs.stringify(params))
    console.log('tappx URL', '/reports/?' + qs.stringify(params))
    console.log(res)
    process.exit()
    const data = res.data
    return data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Tappx report failed'
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
