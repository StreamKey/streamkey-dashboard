import _ from 'lodash'
import winston from 'winston'
import { promiseTimeout } from '../../components/Utils'

import GetTagBase from './GetTagBase'
import MergeAsResults from './MergeAsResults'

import Lkqd from './AS/Lkqd'
import Aniview from './AS/Aniview'
import SpringServe from './AS/SpringServe'
import Cedato from './AS/Cedato'

const PARTNER_FETCH_TIMEOUT_SECONDS = process.env.RAZZLE_PARTNER_FETCH_TIMEOUT_SECONDS

const AdServers = [
  {
    key: 'lkqd',
    controller: Lkqd
  }, {
    key: 'aniview',
    controller: Aniview
  }, {
    key: 'springserve',
    controller: SpringServe
  }, {
    key: 'cedato',
    controller: Cedato
  }
]

const KNOWN_INVALID_TAGS = [
  'LKQD Marketplace - Connected TV',
  'LKQD Marketplace - Mobile App',
  'LKQD Marketplace - Desktop',
  'LKQD Marketplace - Mobile Web',
  'other'
]

export const groupAsResults = (asResults, asKey) => {
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
      const tag = r.tag.toUpperCase()
      if (tag.startsWith('MNL_')) {
        group = groups.mnl
      } else if (tag.startsWith('AUTON_') && tag.endsWith('_WL')) {
        group = groups.auton_wl
      } else if (tag.startsWith('AUTON_') && tag.indexOf('_FOR_') > -1) {
        group = groups.auton_for
      } else if (tag.endsWith('_RON')) {
        group = groups.ron
      } else {
        group = groups.other
        winston.warn('Tag Error', { tag: r.tag, as: asKey })
        return
      }
      group[tagBase] = MergeAsResults(group[tagBase], r)
    } catch (e) {
      if (e.message === 'invalid-tag') {
        if (KNOWN_INVALID_TAGS.includes(r.tag)) {
          groups.other[r.tag] = MergeAsResults(groups.other[r.tag], r)
        }
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

export const fetch = async (dateTs, asList, group = true) => {
  const results = []

  const fetchJobs = AdServers.filter(item => asList.has(item.key)).map(async item => {
    try {
      winston.info('AS Start', { as: item.key })
      const timeoutDuration = PARTNER_FETCH_TIMEOUT_SECONDS * 1000
      const timeoutGetData = promiseTimeout(timeoutDuration, item.controller.getData(dateTs))
      const data = await timeoutGetData
      validateDataStructure(data)
      winston.info('AS Finish', { as: item.key })
      winston.verbose('AS Results', {
        key: item.key,
        data
      })
      results.push({
        key: item.key,
        data: group ? groupAsResults(data, item.key) : data
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
