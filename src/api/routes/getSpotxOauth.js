import axios from 'axios'
import get from 'lodash/get'
import DB from '../../DB/'

const {
  RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_ID,
  RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_SECRET
} = process.env
const TOKEN_URL = 'https://publisher-api.spotxchange.com/1.0/token'

export default async req => {
  const { code, state } = req.query
  const data = {
    client_id: RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_ID,
    client_secret: RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code
  }
  try {
    const res = await axios({
      url: TOKEN_URL,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
    const resData = get(res, 'data.value.data')
    const accessToken = resData.access_token
    const refreshToken = resData.refresh_token

    // Store access_token and refresh_token in DB
    await DB.models.Configs.upsert({
      id: 'SPOTX_ACCESS_TOKEN',
      value: accessToken
    })
    await DB.models.Configs.upsert({
      id: 'SPOTX_REFRESH_TOKEN',
      value: refreshToken
    })

    return {
      success: true,
      token: {
        accessToken,
        refreshToken
      },
      state
    }
  } catch (e) {
    const err = new Error('spotx-oauth-token-error')
    err.details = {
      status: get(e, 'response.status'),
      statusText: get(e, 'response.statusText'),
      ...get(e, 'response.data')
    }
    throw err
  }
}
