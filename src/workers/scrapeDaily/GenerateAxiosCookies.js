import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'

export default () => {
  const instance = axios.create({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36'
    }
  })
  axiosCookieJarSupport(instance)
  const cookieJar = new tough.CookieJar()
  instance.defaults.jar = cookieJar
  instance.defaults.withCredentials = true
  return instance
}
