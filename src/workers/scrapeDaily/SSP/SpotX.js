import axios from 'axios'
import moment from 'moment'
import DB from '../../../DB/'

const apiTokenUrl = 'https://publisher-api.spotxchange.com/1.0/token'
const apiReportsUrl = 'https://api.spotxchange.com/1.0'

const {
  RAZZLE_CREDENTIALS_SPOTX_PUBLISHERID,
  RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_ID,
  RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_SECRET
} = process.env

const getAccessToken = async () => {
  const configs = await DB.models.Configs.findAll({
    where: {
      id: 'SPOTX_REFRESH_TOKEN'
    }
  })
  if (configs.length !== 1) {
    throw new Error('SpotX refresh token not found in DB')
  }
  const refreshToken = configs[0].dataValues.value
  const form = {
    client_id: RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_ID,
    client_secret: RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  }
  const res = await axios.post(apiTokenUrl, form)
  const accessToken = res.data.value.data.access_token

  await DB.models.Configs.upsert({
    id: 'SPOTX_ACCESS_TOKEN',
    value: accessToken
  })
  return accessToken
}

const getResults = async (accessToken, dateTs) => {
  const date = moment.utc(dateTs, 'X').format('YYYY-MM-DD')
  const form = {
    date_range: `${date} | ${date}`
  }
  try {
    const res = await axios.get(`${apiReportsUrl}/Publisher(${RAZZLE_CREDENTIALS_SPOTX_PUBLISHERID})/Channels/RevenueReport`, {
      params: form,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return res.data.value.data
  } catch (e) {
    e.prevError = e.message
    e.message = 'SpotX report failed'
    throw e
  }
}

const normalize = results => {
  return results.map(r => {
    return {
      tag: r.channel_name,
      opp: Number(r.queries),
      imp: Number(r.impressions),
      rev: Number(r.revenue_usd),
      sCost: (Number(r.queries) - Number(r.impressions)) * 0.000007
    }
  })
}

export default {
  getData: async dateTs => {
    const accessToken = await getAccessToken()
    const results = await getResults(accessToken, dateTs)
    return normalize(results)
  }
}
