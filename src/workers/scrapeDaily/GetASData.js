import _ from 'lodash'
import winston from 'winston'

import GetTagBase from './GetTagBase'

// import StreamRail from './AS/StreamRail'
import Lkqd from './AS/Lkqd'
// import Aniview from './AS/Aniview'
// import SpringServe from './AS/SpringServe'

const AdServers = [
  {
  //   key: 'streamrail',
  //   controller: StreamRail
  // }, {
    key: 'lkqd',
    controller: Lkqd
  // }, {
  //   key: 'aniview',
  //   controller: Aniview
  // }, {
  //   key: 'springserve',
  //   controller: SpringServe
  }
]

const groupAsResults = asResults => {
  const groups = {
    mnl: {},
    auton_wl: {},
    auton_for: {},
    ron: {}
  }
  _.each(asResults, r => {
    try {
      const tagBase = GetTagBase(r.tag)
      let group
      if (r.tag.startsWith('MNL_')) {
        group = groups.mnl
      } else if (r.tag.startsWith('AUTON_') && r.tag.endsWith('_WL')) {
        group = groups.auton_wl
      } else if (r.tag.startsWith('AUTON_') && r.tag.indexOf('_FOR_') > -1) {
        group = groups.auton_for
      } else if (r.tag.endsWith('_RON')) {
        group = groups.ron
      } else {
        winston.error('Tag Error', { tag: r.tag })
        return
      }
      group[tagBase] = mergeAsResults(group[tagBase], r)
    } catch (e) {
      winston.error('AS Group Error', {
        message: e.message,
        asResult: r
      })
    }
  })
  return groups
}

const mergeAsResults = (a, b) => {
  if (!a) {
    return b
  } else if (!b) {
    return a
  } else {
    return {
      ...a,
      asOpp: a.asOpp + b.asOpp,
      asImp: a.asImp + b.asImp,
      asRev: a.asRev + b.asRev,
      asCost: a.asCost + b.asCost
    }
  }
}

export default async dateTs => {
  const results = []

  const fetchJobs = AdServers.map(async item => {
    try {
      winston.info('AS Start', { as: item.key })
      const data = await item.controller.getData(dateTs)
      winston.info('AS Finish', { as: item.key })
      results.push({
        key: item.key,
        data: groupAsResults(data)
      })
    } catch (e) {
      winston.error('AS getData Error', {
        message: e.message,
        item
      })
    }
  })
  await Promise.all(fetchJobs)

  return results
}
