import _ from 'lodash'
import winston from 'winston'

import GetTagBase from './GetTagBase'
import MergeAsResults from './MergeAsResults'

const addEmptySspResult = (asKey, asResult, results) => {
  if (!asResult || !asResult.tag) {
    return
  }
  const SSP_KEYS = [
    '_TRM_',
    '_LKD_',
    '_STR_'
  ]
  if (SSP_KEYS.includes(asResult.tag)) {
    winston.error('Wrong empty SSP tag', {
      as: asKey,
      result: asResult
    })
    return
  }
  results.push({
    tag: asResult.tag,
    ssp: null,
    sspOpp: null,
    sspImp: null,
    sspRev: null,
    sspScost: null,
    as: asKey,
    asOpp: asResult.asOpp,
    asImp: asResult.asImp,
    asRev: asResult.asRev,
    asCost: asResult.asCost,
    asScost: asResult.asScost
  })
}

const addEmptySspResults = (asKey, asGroups, results) => {
  _.each(asGroups.mnl, r => {
    addEmptySspResult(asKey, r, results)
  })
  _.each(asGroups.auton_wl, r => {
    addEmptySspResult(asKey, r, results)
  })
  _.each(asGroups.auton_for, r => {
    addEmptySspResult(asKey, r, results)
  })
  _.each(asGroups.ron, r => {
    addEmptySspResult(asKey, r, results)
  })
}

export default (sspResults, asResults) => {
  const results = []
  const allAsResults = {}
  _.each(sspResults, ssp => {
    _.each(ssp.data, sspData => {
      _.each(asResults, as => {
        const asGroups = as.data
        if (!allAsResults[as.key]) {
          allAsResults[as.key] = _.cloneDeep(asGroups)
        }
        if (ssp.key === '_empty_') {
          _.each(asGroups.other, result => {
            results.push({
              tag: result.tag,
              ssp: null,
              sspOpp: null,
              sspImp: null,
              sspRev: null,
              sspScost: null,
              as: as.key,
              asOpp: result.asOpp,
              asImp: result.asImp,
              asRev: result.asRev,
              asCost: result.asCost,
              asScost: result.asScost
            })
          })
          return
        }
        let tagBase
        try {
          tagBase = GetTagBase(sspData.tag)
        } catch (e) {
          winston.error('Invalid SSP Tag', {
            error: e.message,
            ssp: ssp.key,
            sspData
          })
          return
        }
        let result
        if (ssp.key === 'telaria') {
          if (sspData.tag.startsWith('MNL_')) {
            // AS mnl
            result = asGroups.mnl[tagBase]
          } else if ((sspData.tag.toUpperCase()).startsWith('AUTON_') && sspData.tag.endsWith('_WL')) {
            // AS auton_wl
            result = asGroups.auton_wl[tagBase]
          } else if (sspData.tag.endsWith('_RON')) {
            // AS auton_for + ron
            result = MergeAsResults(asGroups.auton_for[tagBase], asGroups.ron[tagBase])
          } else {
            winston.error('Invalid Tag Group', {
              ssp: ssp.key,
              tag: sspData.tag
            })
          }
        } else {
          if (sspData.tag.startsWith('MNL_')) {
            // AS mnl
            result = asGroups.mnl[tagBase]
          } else if ((sspData.tag.toUpperCase()).startsWith('AUTON_')) {
            // AS auton_wl + auton_for + ron
            result = MergeAsResults(
              MergeAsResults(
                asGroups.auton_wl[tagBase],
                asGroups.auton_for[tagBase]
              ),
              asGroups.ron[tagBase]
            )
          } else {
            winston.error('Invalid Tag Group', {
              ssp: ssp.key,
              tag: sspData.tag
            })
          }
        }
        if (result) {
          allAsResults[as.key].mnl[tagBase] = undefined
          allAsResults[as.key].auton_wl[tagBase] = undefined
          allAsResults[as.key].auton_for[tagBase] = undefined
          allAsResults[as.key].ron[tagBase] = undefined
          results.push({
            tag: sspData.tag,
            ssp: ssp.key,
            sspOpp: sspData.opp,
            sspImp: sspData.imp,
            sspRev: sspData.rev,
            sspScost: sspData.sCost,
            as: as.key,
            asOpp: result.asOpp,
            asImp: result.asImp,
            asRev: result.asRev,
            asCost: result.asCost,
            asScost: result.asScost
          })
        }
      })
    })
  })
  _.each(allAsResults, (asGroups, asKey) => {
    addEmptySspResults(asKey, asGroups, results)
  })
  return results
}
