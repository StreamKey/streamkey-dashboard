// WIP

import axios from 'axios'
// import moment from 'moment'

const reportsUrl = 'https://api.tpbid.com/ssb/ext/v2'

const {
  RAZZLE_CREDENTIALS_APPRECIATE_API_KEY
} = process.env

const getResults = async dateTs => {
  // const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    // fromDate: date,
    // toDate: date
  }
  try {
    const res = await axios.get(`${reportsUrl}/campaigns`, {
      params: form,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-Api-Key': RAZZLE_CREDENTIALS_APPRECIATE_API_KEY
      }
    })
    // console.log(res.data.data)
    return res.data.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Appreciate report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.tagName,
      opp: 0,
      imp: Number(r.totalImpressions),
      rev: Number(r.netRevenue),
      sCost: 0
    }
  })
}

export default {
  getData: async dateTs => {
    const results = await getResults(dateTs)
    return normalize(results)
  }
}
