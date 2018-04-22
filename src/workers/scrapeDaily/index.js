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
            const profit = sspData.rev - asData.cost
            const margin = profit / sspData.rev
            results.push({
              tag: sspData.tag,
              ssp: ssp.key,
              sspOpp: sspData.opp,
              sspImp: sspData.imp,
              sspRev: sspData.rev,
              sspCpm: sspData.cpm,
              as: as.key,
              asOpp: asData.opp,
              asImp: asData.imp,
              asCost: asData.cost,
              asCpm: asData.cpm,
              profit,
              margin
            })
          }
        })
      })
    })
  })
  return results
}

const main = async topic => {
  const errors = []
  const utcTime = moment.utc().subtract(1, 'days').startOf('day')
  console.log('utcTime start of day', utcTime)

  await DB.init()

  const sspResults = await GetSSPData(utcTime, errors)
  _.each(sspResults, r => {
    console.log(r.key)
    console.log(_.sampleSize(r.data, 5))
  })

  const asResults = await GetASData(utcTime, errors)
  _.each(asResults, r => {
    console.log(r.key)
    console.log(_.sampleSize(r.data, 5))
  })

  // Match tags
  const merged = mergeByTags(sspResults, asResults)
  const itemsToStore = merged.map(i => ({
    date: utcTime,
    ...i
  }))
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
