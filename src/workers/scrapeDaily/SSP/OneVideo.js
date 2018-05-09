import '../../../../env'

import Axios from 'axios'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import uuid from 'uuid/v4'
import qs from 'querystring'

const credentials = {
  clientId: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_CLIENTID,
  secret: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_SECRET,
  orgId: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_ORGID
}

const authUrl = 'https://id.corp.aol.com/identity/oauth2/access_token'
const apiUrl = 'https://onevideo.aol.com'
const axios = Axios.create()

const generateJwtToken = () => {
  const now = Number(moment().utc().format('X'))
  const payload = {
    algorithm: 'HS256',
    aud: `${authUrl}?realm=aolcorporate/aolexternals`,
    iss: credentials.clientId,
    sub: credentials.clientId,
    exp: now + 600,
    iat: now,
    jti: uuid()
  }
  const jwtToken = jwt.sign(payload, credentials.secret)
  return jwtToken
}

const auth = async () => {
  const jwtToken = generateJwtToken()
  const form = {
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: jwtToken,
    scope: 'one',
    realm: 'aolcorporate/aolexternals'
  }
  try {
    const res = await axios.post(authUrl, qs.stringify(form))
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
  } catch (e) {
    console.error(e)
    throw new Error('OneVideo login failed', e)
  }
}

const runReport = async dateTs => {
  const date = moment.utc(dateTs, 'X')
  const startDate = date.startOf('day').format('X')
  const endDate = date.endOf('day').format('X')
  const params = {
    org_id: credentials.orgId,
    keys: 'date,inventory_source',
    metrics: 'seller_market_opportunities,ad_attempts,ad_impressions,ad_revenue,cpm',
    start_date: startDate,
    end_date: endDate,
    timezone: 1 // UTC
  }
  try {
    const res = await axios.get(`${apiUrl}/reporting/run_report`, { params })
    return res.data
  } catch (e) {
    throw new Error('OneVideo get data failed', e)
  }
}

const normalize = (columns, data) => {
  if (columns[0] !== 'date' ||
      columns[1] !== 'inventory_source' ||
      columns[2] !== 'seller_market_opportunities' ||
      columns[3] !== 'ad_attempts' ||
      columns[4] !== 'ad_impressions' ||
      columns[5] !== 'ad_revenue') {
    throw new Error('AOL invalid report columns')
  }
  return data.map(r => {
    return {
      tag: r.row[1],
      opp: Number(r.row[2]),
      imp: Number(r.row[4]),
      rev: Number(r.row[5]),
      sCost: (Number(r.row[2]) - Number(r.row[4])) * 0.0000007
    }
  })
}

export default {
  getData: async dateTs => {
    try {
      await auth()
      const { columns, data } = await runReport(dateTs)
      return normalize(columns, data)
    } catch (e) {
      throw e
    }
  }
}
