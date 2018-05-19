import _ from 'lodash'
import winston from 'winston'

import GetTagBase from './GetTagBase'
import MergeAsResults from './MergeAsResults'

const addEmptySspResult = (asKey, asResult, results) => {
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

const addEmptySspResults = (asKey, asData, results) => {
  _.each(asData.mnl, d => {
    addEmptySspResult(asKey, d, results)
  })
  _.each(asData.auton_wl, d => {
    addEmptySspResult(asKey, d, results)
  })
  _.each(asData.auton_for, d => {
    addEmptySspResult(asKey, d, results)
  })
  _.each(asData.ron, d => {
    addEmptySspResult(asKey, d, results)
  })
}

export default (sspResults, asResults) => {
  const results = []
  const allAsResults = {}
  _.each(sspResults, ssp => {
    _.each(ssp.data, sspData => {
      _.each(asResults, as => {
        const asData = as.data
        if (!allAsResults[as.key]) {
          allAsResults[as.key] = asData
        }
        if (ssp.key === '_empty_') {
          _.each(asData.other, result => {
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
            result = asData.mnl[tagBase]
          } else if (sspData.tag.startsWith('AUTON_') && sspData.tag.endsWith('_WL')) {
            // AS auton_wl
            result = asData.auton_wl[tagBase]
          } else if (sspData.tag.endsWith('_RON')) {
            // AS auton_for + ron
            result = MergeAsResults(asData.auton_for[tagBase], asData.ron[tagBase])
          } else {
            winston.error('Invalid Tag Group', {
              ssp: ssp.key,
              tag: sspData.tag
            })
          }
        } else {
          if (sspData.tag.startsWith('MNL_')) {
            // AS mnl
            result = asData.mnl[tagBase]
          } else if (sspData.tag.startsWith('AUTON_')) {
            // AS auton_wl + auton_for + ron
            result = MergeAsResults(
              MergeAsResults(
                asData.auton_wl[tagBase],
                asData.auton_for[tagBase]
              ),
              asData.ron[tagBase]
            )
          } else {
            winston.error('Invalid Tag Group', {
              ssp: ssp.key,
              tag: sspData.tag
            })
          }
        }
        if (result) {
          delete allAsResults[as.key].mnl[tagBase]
          delete allAsResults[as.key].auton_wl[tagBase]
          delete allAsResults[as.key].auton_for[tagBase]
          delete allAsResults[as.key].ron[tagBase]
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
  _.each(allAsResults, (asData, asKey) => {
    addEmptySspResults(asKey, asData, results)
  })
  return results
}
