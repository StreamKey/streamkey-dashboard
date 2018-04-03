import '../../env'
import _ from 'lodash'
import moment from 'moment'

import DB from '../DB/'

const main = async topic => {
  await DB.init()
  // Get SSP data

  // Get AS data

  // Match tags
  const utcTime = moment.utc().startOf('day').format('YYYY-MM-DD HH:mm:ss+0000')
  console.log('utcTime start of day', utcTime)
  const itemsToStore = [
    {
      date: utcTime,
      ssp: 'SSP1',
      as: 'AS1',
      tag: 'TAG2'
    }
  ]

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
