import _ from 'lodash'
import winston from 'winston'

import GetTagBase from './GetTagBase'
import MergeAsResults from './MergeAsResults'

import StreamRail from './AS/StreamRail'
import Lkqd from './AS/Lkqd'
import Aniview from './AS/Aniview'
// import SpringServe from './AS/SpringServe'

const AdServers = [
  {
    key: 'streamrail',
    controller: StreamRail
  }, {
    key: 'lkqd',
    controller: Lkqd
  }, {
    key: 'aniview',
    controller: Aniview
  // }, {
  //   key: 'springserve',
  //   controller: SpringServe
  }
]

const KNOWN_INVALID_TAGS = [
  'LKQD Marketplace - Connected TV',
  'LKQD Marketplace - Mobile App',
  'LKQD Marketplace - Desktop',
  'LKQD Marketplace - Mobile Web',
  'other'
]

const groupAsResults = (asResults, asKey) => {
  const groups = {
    mnl: {},
    auton_wl: {},
    auton_for: {},
    ron: {},
    other: {}
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
        group = groups.other
        winston.warn('Tag Error', { tag: r.tag, as: asKey })
        return
      }
      group[tagBase] = MergeAsResults(group[tagBase], r)
    } catch (e) {
      if (e.message === 'invalid-tag' && KNOWN_INVALID_TAGS.includes(r.tag)) {
        groups.other[r.tag] = MergeAsResults(groups.other[r.tag], r)
      } else {
        winston.error('AS Group Error', {
          error: e.message,
          asKey,
          asResult: r
        })
      }
    }
  })
  return groups
}

const validateDataStructure = data => {
  _.each(data, d => {
    if (
      !_.isString(d.tag) ||
      !_.isInteger(d.asOpp) ||
      !_.isInteger(d.asImp) ||
      !_.isNumber(d.asRev) ||
      !_.isNumber(d.asCost) ||
      !_.isNumber(d.asScost)
    ) {
      winston.error('Invalid AS Result', { result: d })
    }
  })
}

export default async dateTs => {
  const results = []

  const fetchJobs = AdServers.map(async item => {
    try {
      winston.info('AS Start', { as: item.key })
      const data = await item.controller.getData(dateTs)
      validateDataStructure(data)
      winston.info('AS Finish', { as: item.key })
      winston.verbose('AS Results', {
        key: item.key,
        data
      })
      results.push({
        key: item.key,
        data: groupAsResults(data, item.key)
      })
    } catch (e) {
      winston.error('AS getData Error', {
        as: item.key,
        error: e.message,
        prevError: e.prevError,
        extra: e.extra,
        resCode: _.get(e, 'response.status', null),
        resText: _.get(e, 'response.statusText', null),
        reqUrl: _.get(e, 'response.config.url', null)
      })
    }
  })
  await Promise.all(fetchJobs)

  return results
}
