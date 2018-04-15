import '../../../../env'

import axios from 'axios'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import uuid from 'uuid/v4'
import qs from 'querystring'

const credentials = {
  clientId: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_CLIENTID,
  secret: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_SECRET
}
const authUrl = 'https://id-uat2.corp.aol.com/identity/oauth2/access_token'

const generateJwtToken = () => {
  const now = Number(moment().utc().format('X'))
  const payload = {
    algorithm: 'HS256',
    aud: `${authUrl}?realm=aolcorporate/aolexternals`,
    iss: credentials.clientId,
    sub: credentials.clientId,
    exp: 600,
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
    return res.data
  } catch (e) {
    console.error(e)
    throw new Error('AOL login failed', e)
  }
}

const main = async () => {
  const oAuthToken = await auth()
  console.log(oAuthToken)
}

main()
