import _ from 'lodash'
import winston from 'winston'
import { promiseTimeout } from '../../components/Utils'

import _Empty_ from './SSP/_Empty_'
import Telaria from './SSP/Telaria'
import Freewheel from './SSP/Freewheel'
import Beachfront from './SSP/Beachfront'
import Aerserv from './SSP/Aerserv'
// import SpotX from './SSP/SpotX'
import OneVideo from './SSP/OneVideo'
// import Peak from './SSP/Peak'
// import Tappx from './SSP/Tappx'

const PARTNER_FETCH_TIMEOUT_SECONDS = process.env.RAZZLE_PARTNER_FETCH_TIMEOUT_SECONDS

const SSPs = [
  {
    key: '_empty_',
    controller: _Empty_
  }, {
    key: 'telaria',
    controller: Telaria
  }, {
    key: 'freewheel',
    controller: Freewheel
  }, {
    key: 'beachfront',
    controller: Beachfront
  }, {
    key: 'aerserv',
    controller: Aerserv
  }, {
  //   key: 'spotx',
  //   controller: SpotX
  // }, {
    key: 'onevideo',
    controller: OneVideo
  // }, {
  //   key: 'peak',
  //   controller: Peak
  // }, {
  //   key: 'tappx',
  //   controller: Tappx
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
    opp: a.opp + b.opp,
    imp: a.imp + b.imp,
    rev: a.rev + b.rev,
    sCost: a.sCost + b.sCost
  }
}

const validateDataStructure = data => {
  _.each(data, d => {
    if (
      !_.isString(d.tag) ||
      !_.isInteger(d.opp) ||
      !_.isInteger(d.imp) ||
      !_.isNumber(d.rev) ||
      !_.isNumber(d.sCost)
    ) {
      winston.error('Invalid SSP Result', { result: d })
    }
  })
}

export default async (dateTs, sspList) => {
  const results = []

  const fetchJobs = SSPs.filter(item => sspList.has(item.key)).map(async item => {
    try {
      winston.info('SSP Start', { ssp: item.key })
      const timeoutDuration = PARTNER_FETCH_TIMEOUT_SECONDS * 1000
      const timeoutGetData = promiseTimeout(timeoutDuration, item.controller.getData(dateTs))
      const data = await timeoutGetData
      if (item.key !== '_empty_') {
        validateDataStructure(data)
      }
      winston.info('SSP Finish', { ssp: item.key })
      const reducedData = reduceByTag(data)
      winston.verbose('SSP Results', {
        key: item.key,
        data,
        reducedData
      })
      results.push({
        key: item.key,
        data: reducedData
      })
    } catch (e) {
      winston.error('SSP getData Error', {
        ssp: item.key,
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
