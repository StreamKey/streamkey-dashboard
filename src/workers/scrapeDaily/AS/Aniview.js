import CryptoJS from 'crypto-js'
import WebSocket from 'ws'
import Tough from 'tough-cookie'
import qs from 'querystring'
import csv from 'csvtojson'
import winston from 'winston'

import GenerateAxiosCookies from '../GenerateAxiosCookies'

const axios = GenerateAxiosCookies({ returnJar: true })

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_ANIVIEW_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_ANIVIEW_PASSWORD
}

// Assumes a saved "yesterday" report
const reportId = process.env.RAZZLE_CREDENTIALS_ANIVIEW_REPORTID

axios.axios.defaults.baseURL = 'http://manage.aniview.com/api'

const encryptPassword = (password, config) => {
  const key = CryptoJS.enc.Hex.parse(config.authentication.key)
  const keyIv = CryptoJS.enc.Hex.parse(config.authentication.key_iv)
  return CryptoJS.AES.encrypt(password, key, { iv: keyIv }).ciphertext.toString(CryptoJS.enc.Base64)
}

const getConfig = async () => {
  try {
    const res = await axios.axios.get('/config')
    const fullConfig = JSON.parse(res.data.replace(/^var configHelper =/, ''))
    const config = {
      currentInstanceId: fullConfig.currentInstanceId,
      authentication: {
        key: fullConfig.authentication.key,
        key_iv: fullConfig.authentication.key_iv
      }
    }
    return config
  } catch (e) {
    e.prevError = e.message
    e.message = 'Aniview config parse failed'
    throw e
  }
}

const login = async config => {
  const form = {
    accountId: config.currentInstanceId,
    id: credentials.username,
    password: encryptPassword(credentials.password, config)
  }
  try {
    const res = await axios.axios.post('/token?format=json', form)
    const { token } = res.data.data
    const tokenCookie = new Tough.Cookie({
      key: 'token',
      value: token
    })
    axios.jar.setCookieSync(tokenCookie, axios.axios.defaults.baseURL)
  } catch (e) {
    e.prevError = e.message
    e.message = 'Aniview login failed'
    throw e
  }
}

const getResultsSocket = async dateTs => {
  try {
    const params = {
      format: 'json',
      asFile: false,
      async: true,
      statsFormat: 'csv'
    }
    const res = await axios.axios.get(`/adserver/stats/report-by-id/id/${reportId}`, { params })
    const { socketAddress } = res.data.data
    return socketAddress
  } catch (e) {
    e.prevError = e.message
    e.message = 'Aniview report failed'
    throw e
  }
}

const getReportLink = socketAddress => {
  return new Promise(resolve => {
    const ws = new WebSocket(socketAddress)
    ws.on('message', data => {
      const jsonData = JSON.parse(data)
      const encodedLink = qs.parse(jsonData.text).data
      ws.terminate()
      resolve(encodedLink)
    })
  })
}

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const downloadReport = link => {
  return new Promise(async (resolve, reject) => {
    const axiosAws = GenerateAxiosCookies()
    try {
      let res
      try {
        res = await axiosAws.get(link)
      } catch (e) {
        winston.warn('Aniview downloadReport failed once')
        await sleep(15000)
        res = await axiosAws.get(link)
      }
      const rawData = res.data
      const sections = rawData.replace('\r\n', '\n').split('\n\n')
      const csvStr = sections[sections.length - 1]
      const jsonArr = await csv().fromString(csvStr)
      resolve(jsonArr)
    } catch (e) {
      e.prevError = e.message
      e.message = 'Aniview downloadReport failed twice'
      reject(e)
    }
  })
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r['Ad Source Name'],
      asOpp: Number(r['Request']),
      asImp: Number(r['Impression']),
      asRev: Number(r['Revenue']),
      asCost: Number(r['Total Cost']),
      asScost: Number(r['Impression']) * 0.00025
    }
  })
}

export default {
  getData: async dateTs => {
    try {
      const config = await getConfig()
      await login(config)
      const socketAddress = await getResultsSocket(dateTs)
      const reportLink = await getReportLink(socketAddress)
      const results = await downloadReport(reportLink)
      return normalize(results)
    } catch (e) {
      throw e
    }
  }
}
