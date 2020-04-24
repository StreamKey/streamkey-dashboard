export const isDev = process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT'
export const isProd = process.env.NODE_ENV.toUpperCase() === 'PRODUCTION'
export const isTest = process.env.NODE_ENV.toUpperCase() === 'TEST'
export const partnersMap = {
  aniview: 'Aniview',
  lkqd: 'LKQD',
  springserve: 'Springserve',
  cedato: 'Cedato',
  aerserv: 'Aerserv',
  beachfront: 'Beachfront',
  freewheel: 'Freewheel',
  telaria: 'Telaria',
  improvedigital: 'ImproveDigital',
  tappx: 'Tappx',
  pulsepointctv: 'PulsePointCTV',
  v2v: 'V2V'
}
export const getPartnerName = key => partnersMap[key] || key
export const asList = [
  'lkqd',
  'aniview',
  'springserve',
  'cedato'
]
export const sspList = [
  'telaria',
  'freewheel',
  'beachfront',
  'aerserv',
  'improvedigital',
  'tappx'
]

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
