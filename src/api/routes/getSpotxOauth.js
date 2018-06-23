import axios from 'axios'
import get from 'lodash/get'

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
    return {
      success: true,
      token: get(res, 'data.value.data'),
      state
    }
  } catch (e) {
    const err = new Error('spotx-oauth-token-error')
    err.details = {
      status: e.response.status,
      statusText: e.response.statusText,
      ...e.response.data
    }
    throw err
  }
}
