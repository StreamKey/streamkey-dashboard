import _ from 'lodash'
import winston from 'winston'

import GetTagBase from './GetTagBase'
import MergeAsResults from './MergeAsResults'

const addEmptySspResult = (asKey, result, emptySspResults) => {
  const SSP_KEYS = [
    '_TRM_',
    '_LKD_',
    '_STR_'
  ]
  if (SSP_KEYS.contains(result.tag)) {
    winston.error('Wrong empty SSP tag', {
      as: asKey,
      result
    })
    return
  }
  if (!emptySspResults[asKey]) {
    emptySspResults[asKey] = []
  }
  emptySspResults[asKey].push(result)
}

export default (sspResults, asResults) => {
  const results = []
  const emptySspResults = {}
  _.each(sspResults, ssp => {
    _.each(ssp.data, sspData => {
      _.each(asResults, as => {
        const asData = as.data
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
            // Empty SSP
            return addEmptySspResult(as.key, result, emptySspResults)
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
            // Empty SSP
            return addEmptySspResult(as.key, result, emptySspResults)
          }
        }
        if (result) {
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
  console.log(emptySspResults)
  return results
}
