import _ from 'lodash'
import winston from 'winston'

import Telaria from './SSP/Telaria'
// import Freewheel from './SSP/Freewheel'
// import Beachfront from './SSP/Beachfront'
// import Aerserv from './SSP/Aerserv'
// import SpotX from './SSP/SpotX'
// import OneVideo from './SSP/OneVideo'

const SSPs = [
  {
    key: 'telaria',
    controller: Telaria
  // }, {
  //   key: 'freewheel',
  //   controller: Freewheel
  // }, {
  //   key: 'beachfront',
  //   controller: Beachfront
  // }, {
  //   key: 'aerserv',
  //   controller: Aerserv
  // }, {
  //   key: 'spotx',
  //   controller: SpotX
  // }, {
  //   key: 'onevideo',
  //   controller: OneVideo
  }
]

const reduceByTag = results => {
  const tags = {}
  _.each(results, r => {
    if (tags[r.tag]) {
      tags[r.tag] = mergeResults(tags[r.tag], r)
    } else {
      tags[r.tag] = r
    }
  })
  return _.values(tags)
}

const mergeResults = (a, b) => {
  return {
    ...a,
    sspOpp: a.sspOpp + b.sspOpp,
    sspImp: a.sspImp + b.sspImp,
    sspRev: a.sspRev + b.sspRev
  }
}

export default async dateTs => {
  const results = []

  const fetchJobs = SSPs.map(async item => {
    try {
      winston.info('SSP Start', { ssp: item.key })
      const data = await item.controller.getData(dateTs)
      winston.info('SSP Finish', { ssp: item.key })
      results.push({
        key: item.key,
        data: reduceByTag(data)
      })
    } catch (e) {
      winston.error('SSP getData Error', {
        message: e.message,
        item
      })
    }
  })
  await Promise.all(fetchJobs)

  return results
}
