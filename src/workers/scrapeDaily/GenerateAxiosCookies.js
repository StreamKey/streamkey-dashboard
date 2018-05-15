import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'
import axiosRetry from 'axios-retry'

const SAFE_HTTP_METHODS = ['get', 'head', 'options']
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete'])
const isIdempotentRequestError = error => {
  if (!error.config) {
    return false
  }
  return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1
}
const isRetryableError = error => {
  return error.code !== 'ECONNABORTED' &&
    (!error.response || (error.response.status >= 400 && error.response.status <= 599))
}

export default (options = {}) => {
  const { returnJar } = options
  const instance = axios.create({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36'
    }
  })
  axiosCookieJarSupport(instance)
  const cookieJar = new tough.CookieJar()
  instance.defaults.jar = cookieJar
  instance.defaults.withCredentials = true
  if (returnJar === true) {
    return {
      axios: instance,
      jar: cookieJar
    }
  }
  if (options.disableRetries !== true) {
    if (options.retryOptions) {
      axiosRetry(axios, options.retryOptions)
    } else {
      axiosRetry(axios, {
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: error => {
          console.log(error)
          return axiosRetry.isNetworkError(error) || isIdempotentRequestError(error)
        }
      })
    }
  }
  return instance
}
