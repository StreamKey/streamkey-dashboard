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
              sspCpm: sspData.cpm,
              as: as.key,
              asOpp: asData.opp,
              asImp: asData.imp,
              asCost: asData.cost,
              asCpm: asData.cpm,
              profit: sspData.rev - asData.cost,
              margin: (sspData.rev - asData.cost) / sspData.rev * 100
            })
          }
        })
      })
    })
  })
  return results
}

const main = async topic => {
  const utcTime = moment.utc().startOf('day').format('YYYY-MM-DD HH:mm:ss+0000')
  console.log('utcTime start of day', utcTime)

  await DB.init()
  const sspResults = await GetSSPData(utcTime)
  const asResults = await GetASData(utcTime)

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

  await DB.close()
}

main()
