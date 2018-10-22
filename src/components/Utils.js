export const isDev = process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT'
export const isProd = process.env.NODE_ENV.toUpperCase() === 'PRODUCTION'
export const isTest = process.env.NODE_ENV.toUpperCase() === 'TEST'
export const partnersMap = {
  aniview: 'Aniview',
  lkqd: 'LKQD',
  springserve: 'Springserve',
  streamrail: 'Streamrail',
  aerserv: 'Aerserv',
  beachfront: 'Beachfront',
  freewheel: 'Freewheel',
  onevideo: 'OneVideo',
  spotx: 'SpotX',
  telaria: 'Telaria',
  improvedigital: 'ImproveDigital'
}
export const getPartnerName = key => partnersMap[key] || key

export const promiseTimeout = (ms, promise) => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timed out after ${ms} ms`))
    }, ms)
  })
  return Promise.race([
    promise,
    timeout
  ])
}
