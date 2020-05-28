import Axios from 'axios'
import moment from 'moment'
import querystring from 'querystring'
import winston from 'winston'
import Sequelize from 'sequelize'
import DB from '../../../DB/'

const credentials = {
  key: process.env.RAZZLE_CREDENTIALS_CEDATO_APIKEY,
  secret: process.env.RAZZLE_CREDENTIALS_CEDATO_APISECRET
}

const toBase64 = str => {
  return Buffer.from(str).toString('base64')
}

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const authStr = `${credentials.key}:${credentials.secret}`
const axios = Axios.create({
  baseURL: 'https://api.cedato.com/api',
})

const getReportLinks = async dateTs => {
  const form = {
    "dimensions": [
      "demand",
      "day"
    ],
    "range": "yesterday",
    "measures": ["ad requests", "impressions", "revenue"]
  }
  const costsForm = {
    "dimensions": [
      "supply partner"
    ],
    "range":"yesterday",
    "measures":["cost"]
  }
  try {
    const tokenRes = await axios.post(
      '/token',
      querystring.stringify({ 'grant_type': 'client_credentials' }),
      {
        headers: {
          'Authorization': `Basic ${toBase64(authStr)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    const token = tokenRes.data.data.access_token
    const reportRes = await axios.post(
      '/v2.0/reports/',
      form,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    const costsRes = await axios.post(
      '/v2.0/reports/',
      costsForm,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    return [reportRes.data.data, costsRes.data.data]
  } catch (e) {
    e.prevError = e.message
    e.message = 'Cedato report failed'
    throw e
  }
}

const downloadReport = async reportUrl => {
  try {
    await sleep(15000)
    let res
    try {
      res = await axios.get(reportUrl)
      if (res.data.data.includes('Report is not processed yet')) {
        winston.warn(`Cedato downloadReport failed once (${reportUrl})`)
        throw new Error('Cedato report is not ready yet')
      }
    } catch (e) {
      await sleep(60000)
      res = await axios.get(reportUrl)
      if (res.data.data.includes('Report is not processed yet')) {
        winston.warn('Cedato downloadReport failed twice')
        throw new Error('Cedato report is still not ready')
      }
    }
    return res.data.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'Cedato downloadReport failed twice'
    throw e
  }
}

const storeCosts = async (dateTs, costs) => {
  const deleteRange = [
    moment(dateTs).startOf('day').toDate(),
    moment(dateTs).endOf('day').toDate()
  ]
  // Clear existing records for this day
  try {
    const deleted = await DB.models.CedatoCosts.destroy({
      where: {
        date: {
          [Sequelize.Op.between]: deleteRange
        }
      }
    })
    winston.info('Clear Cedato costs existing records', {
      deleteRange,
      deleted
    })
  } catch (e) {
    winston.error('Clear Cedato costs existing records error', {
      error: e.message
    })
  }
  // Store data
  const storeCedatoCostsData = []
  for (let c of costs) {
    storeCedatoCostsData.push({
      date: dateTs,
      partner: c[0],
      cost: c[1]
    })
  }
  try {
    await DB.models.CedatoCosts.bulkCreate(storeCedatoCostsData)
    winston.info('Store Cedato costs done', { created: storeCedatoCostsData.length })
  } catch (e) {
    winston.error('Store Cedato costs error', {
      error: e.message,
      storeCedatoCostsData
    })
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r[1],
      asOpp: r[4],
      asImp: r[5],
      asRev: r[6],
      asCost: 0,
      asScost: (r[5] / 1000) * 0.2
    }
  })
}

export default {
  getData: async dateTs => {
    try {
      const [reportLink, costsLink] = await getReportLinks(dateTs)
      const results = await downloadReport(reportLink)
      const costs = await downloadReport(costsLink)
      await storeCosts(dateTs, costs)
      return normalize(results)
    } catch (e) {
      throw e
    }
  }
}
