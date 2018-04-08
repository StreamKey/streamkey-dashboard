import moment from 'moment'
import qs from 'querystring'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_LKQD_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_LKQD_PASSWORD
}

axios.defaults.baseURL = 'https://ui-api.lkqd.com'
axios.defaults.headers = {
  'LKQD-Api-Version': 75
}

const waitAsync = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const login = async () => {
  const form = {
    login: credentials.username,
    password: credentials.password,
    rememberMe: true
  }
  try {
    const res = await axios.post('/sessions', form)
  } catch (e) {
    console.error(e)
    throw new Error('LKQD login failed', e)
  }
}

const getResults = async dateTs => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    whatRequest: 'breakdown',
    uuid: 'bb0cef31-035b-5bf8-894f-7a3d502c414c',
    reportFormat:' JSON',
    includeSummary: true,
    dateRangeType: 'YESTERDAY',
    "startDate": date,
    "endDate": date,
    startHour: 0,
    endHour: 23,
    timeDimension: 'OVERALL',
    timezone: 'UTC',
    reportType: ['SITE'],
    environmentIds: [1, 2, 3, 4],
    filters: [
      {
        dimension: 'ENVIRONMENT',
        operation: 'include',
        filters: [
          {
            matchType: 'id',
            value: '1',
            label: 'Mobile Web'
          }, {
            matchType: 'id',
            value: '2',
            label: 'Mobile App'
          }, {
            matchType: 'id',
            value: '3',
            label: 'Desktop'
          }, {
            matchType: 'id',
            value: '4',
            label: 'CTV'
          }
        ]
      }
    ],
    metrics: [
      'OPPORTUNITIES',
      'IMPRESSIONS',
      'FILL_RATE',
      'EFFICIENCY',
      'CPM',
      'REVENUE',
      'COST',
      'PROFIT',
      'PROFIT_MARGIN',
      'CTR',
      'FIRST_QUARTILE_RATE',
      'MIDPOINT_RATE',
      'THIRD_QUARTILE_RATE',
      'VTR'
    ],
    sort: [{
      field: 'REVENUE',
      order: 'desc'
    }],
    offset: 0,
    limit: 200
  }
  try {
    const res = await axios.post('/reports', form)
    return res.data.data.entries
  } catch (e) {
    console.error(e)
    throw new Error('Lkqd report failed', e)
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.fieldName,
      opp: r.adImpressions,
      imp: r.adCompletedViews,
      rev: r.revenue,
      cpm: r.cpm
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
