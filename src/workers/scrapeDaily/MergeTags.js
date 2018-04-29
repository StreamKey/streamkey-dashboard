import _ from 'lodash'

import GetTagBase from './GetTagBase'
import MergeAsResults from './MergeAsResults'

export default (sspResults, asResults) => {
  const results = []
  _.each(sspResults, ssp => {
    _.each(ssp.data, sspData => {
      _.each(asResults, as => {
        _.each(as.data, asData => {
          const tagBase = GetTagBase(sspData.tag)
          let result
          if (ssp.key === 'telaria') {
            if (sspData.tag.startsWith('MNL_')) {
              // AS mnl
              result = asData.mnl[tagBase]
            } else if (sspData.tag.startsWith('AUTON_')) {
              // AS auton_wl
              result = asData.auton_wl[tagBase]
            } else {
              result = MergeAsResults(asData.auton_for[tagBase], asData.ron[tagBase])
              // AS auton_for + ron
            }
          } else {
            if (sspData.tag.startsWith('MNL_')) {
              // AS mnl
              result = asData.mnl[tagBase]
            } else {
              // AS auton_wl + auton_for + ron
              result = MergeAsResults((MergeAsResults(asData.auton_wl[tagBase], asData.auton_for[tagBase]), asData.ron[tagBase]))
            }
          }
          if (result) {
            results.push({
              tag: sspData.tag,
              ssp: ssp.key,
              sspOpp: sspData.opp,
              sspImp: sspData.imp,
              sspRev: sspData.rev,
              as: result.as,
              asOpp: result.opp,
              asImp: result.imp,
              asRev: result.rev,
              asCost: result.cost
            })
          }
        })
      })
    })
  })
  return results
}
