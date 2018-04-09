import '../../../../env'

import axios from 'axios'
import tough from 'tough-cookie'

const credentials = {
  username: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_USERNAME,
  password: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_PASSWORD,
  client_id: process.env.RAZZLE_CREDENTIALS_ONEVIDEO_CLIENTID
}

const main = async () => {
  const res = await axios({
    url: 'https://id.corp.aol.com/identity/json/authenticate',
    method: 'post',
    params: {
      manageCrossRealm: 'true',
      response_type: 'id_token token',
      realm: '/aolcorporate/aolexternals',
      client_id: credentials.client_id,
      scope: 'openid',
      login_hint: credentials.username
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'Content-Type': 'application/json'
    }
  })
  const jwtToken = res.data.authId
  console.log(jwtToken)

  let cookies
  let cookieStr = ''
  if (res.headers['set-cookie'] instanceof Array) {
    cookies = res.headers['set-cookie'].map(tough.Cookie.parse)
  } else {
    cookies = [tough.Cookie.parse(res.headers['set-cookie'])]
  }
  cookies.map(c => {
    if (c.key === 'amlbcookie') {
      c.domain = ''
      cookieStr = c.toString()
    }
  })

  const res2 = await axios({
    url: 'https://id.corp.aol.com/identity/json/authenticate',
    method: 'post',
    data: {
      authId: jwtToken,
      routingRealm: '/aolcorporate/aolexternals',
      template: '',
      stage: 'RealmRouter1',
      header: 'ENTERPRISE LOGIN SERVICE',
      callbacks: [{type: 'NameCallback',
      output: [{name: 'prompt',
      value: 'Username'}],
      input: [{name: 'IDToken1',
      value: credentials.username}]},
      {type: 'TextOutputCallback',
      output: [{name: 'message',
      value: ' '},
      {name: 'messageType',
      value: '2'}]}]
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'Content-Type': 'application/json',
      'Cookie': cookieStr,
      'Accept-API-Version': 'protocol=1.0,resource=2.0',
      'X-NoSession': 'true',
      'X-Password': 'anonymous',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Username': 'anonymous'
    },
    withCredentials: true
  })
  console.log(res2)

  const res3 = await axios({
    url: 'https://id.corp.aol.com/identity/json/authenticate',
    method: 'post',
    data: {
      authId: jwtToken,
      routingRealm: '/aolcorporate/aolexternals',
      template: '',
      stage: 'RealmRouter2',
      header: 'Username',
      callbacks: [{type: 'TextOutputCallback',
      output: [{name: 'message',
      value: credentials.username},
      {name: 'messageType',
      value: '0'}]},
      {type: 'PasswordCallback',
      output: [{name: 'prompt',
      value: 'Password'}],
      input: [{name: 'IDToken2',
      value: credentials.password}]}]
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'Content-Type': 'application/json',
      'Cookie': cookieStr
    },
    withCredentials: true
  })
  console.log(res3.headers)
}

main()
