import moment from 'moment'
import csv from 'csvtojson'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies()

const credentials = {
  hashKey: process.env.RAZZLE_CREDENTIALS_AERSERV_KEY,
  username: process.env.RAZZLE_CREDENTIALS_AERSERV_USERNAME
}

axios.defaults.baseURL = 'https://platform.aerserv.com/site_reports/export'

const getResults = dateTs => {
  return new Promise(async (resolve, reject) => {
    const date = moment.utc(dateTs, 'X').format('MM/DD/YYYY')
    const form = {
      report_from_date: date,
      report_to_date: date,
      hash: credentials.hashKey,
      username: credentials.username,
      report_type: 'canned_placement',
      no_export_headers: 0
    }
    try {
      const res = await axios.get('/', { params: form })
      const csvStr = res.data
      if (csvStr.startsWith('Error')) {
        throw new Error(csvStr)
      }
      const jsonArr = await csv().fromString(csvStr)
      resolve(jsonArr)
    } catch (e) {
      e.prevError = e.message
      e.message = 'Aerserv report failed'
      reject(e)
    }
  })
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r['Placement'],
      opp: Number(r['Requests']),
      imp: Number(r['Impressions']),
      rev: Number(r['Estimated Earnings'].replace(/^\$/, '')),
      sCost: 0 // TODO
    }
  })
}

export default {
  getData: async dateTs => {
    const results = await getResults(dateTs)
    return normalize(results)
  }
}
