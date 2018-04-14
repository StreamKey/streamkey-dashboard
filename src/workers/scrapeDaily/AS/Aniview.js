import CryptoJS from 'crypto-js'
import WebSocket from 'ws'
import Tough from 'tough-cookie'
import qs from 'querystring'
import csv from 'csvtojson'

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
    console.error(e)
    throw new Error('Aniview config parse failed', e)
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
    console.error(e)
    throw new Error('Aniview login failed', e)
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
    console.error(e)
    throw new Error('Aniview report failed', e)
  }
}

const getReportLink = socketAddress => {
  return new Promise(resolve => {
    const ws = new WebSocket(socketAddress)
    ws.on('message', data => {
      const jsonData = JSON.parse(data)
      const encodedLink = qs.parse(jsonData.text).data
      resolve(encodedLink)
    })
  })
}

const downloadReport = link => {
  return new Promise(async resolve => {
    const axiosAws = GenerateAxiosCookies()
    const res = await axiosAws.get(link)
    const rawData = res.data
    const sections = rawData.replace('\r\n', '\n').split('\n\n')
    const csvStr = sections[sections.length - 1]
    csv()
      .fromString(csvStr)
      .on('end_parsed', jsonArr => {
        resolve(jsonArr)
      })
  })
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r['Ad Source Name'],
      opp: r['Request'],
      imp: r['Impression'],
      rev: r['Revenue'],
      cpm: r['Cpm']
    }
  })
}

export default {
  getData: async dateTs => {
    const config = await getConfig()
    await login(config)
    const socketAddress = await getResultsSocket(dateTs)
    const reportLink = await getReportLink(socketAddress)
    const results = await downloadReport(reportLink)
    return normalize(results)
  }
}
