import _ from 'lodash'

import StreamRail from './AS/StreamRail'
import Lkqd from './AS/Lkqd'
import Aniview from './AS/Aniview'
import SpringServe from './AS/SpringServe'

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
    asOpp: a.asOpp + b.asOpp,
    asImp: a.asImp + b.asImp,
    asCost: a.asCost + b.asCost
  }
}

export default async (dateTs, errors) => {
  const results = []

  const fetchJobs = AdServers.map(async item => {
    try {
      console.log(`[${item.key}] Start`)
      const data = await item.controller.getData(dateTs)
      console.log(`[${item.key}] Finish`)
      results.push({
        key: item.key,
        data: reduceByTag(data)
      })
    } catch (e) {
      errors.push(e)
    }
  })
  await Promise.all(fetchJobs)

  return results
}
