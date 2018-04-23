import '../../../env'
import _ from 'lodash'
import moment from 'moment'

import DB from '../../DB/'
import GetSSPData from './GetSSPData'
import GetASData from './GetASData'

const mergeByTags = (sspResults, asResults) => {
  const results = []
  _.each(sspResults, ssp => {
    _.each(ssp.data, sspData => {
      _.each(asResults, as => {
        _.each(as.data, asData => {
          if (sspData.tag === asData.tag) {
            results.push({
              tag: sspData.tag,
              ssp: ssp.key,
              sspOpp: sspData.opp,
              sspImp: sspData.imp,
              sspRev: sspData.rev,
              as: as.key,
              asOpp: asData.opp,
              asImp: asData.imp,
              asCost: asData.cost
            })
          }
        })
      })
    })
  })
  return results
}

const calcProfit = (results, date) => {
  return results.map(r => {
    const profit = r.sspRev - r.asCost
    const margin = r.sspRev === 0 ? 0 : profit / r.sspRev
    const sspCpm = r.sspImp === 0 ? 0 : ((r.sspRev / r.sspImp) * 1000)
    const asCpm = r.asImp === 0 ? 0 : ((r.asCost / r.asImp) * 1000)
    return {
      ...r,
      date,
      profit,
      margin,
      sspCpm,
      asCpm
    }
  })
}

const main = async topic => {
  const errors = []
  const utcTime = moment.utc().subtract(1, 'days').startOf('day')
  console.log('utcTime start of day', utcTime)

  await DB.init()

  const sspResults = await GetSSPData(utcTime, errors)
  const asResults = await GetASData(utcTime, errors)

  // Match tags
  const merged = mergeByTags(sspResults, asResults)
  const itemsToStore = calcProfit(merged, utcTime)
  console.log('itemsToStore', itemsToStore)

  // Store data
  const storeJobs = itemsToStore.map(async item => {
    await DB.models.Reports.upsert(item)
  })
  try {
    await Promise.all(storeJobs)
  } catch (e) {
    console.error(e)
  }

  if (errors.length > 0) {
    console.log('[ERRORS]')
    console.log(errors)
    errors.map(e => console.log)
  }
  await DB.close()
}

main()
