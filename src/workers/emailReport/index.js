import '../../../env'
import moment from 'moment'

import DB from '../../DB/'

import PublishDiscrepancyReport from '../../api/controllers/Google/PublishDiscrepancyReport'

const getScriptDate = () => {
  for (let i in process.argv) {
    const next = Number(i) + 1
    if (process.argv[i] === '--date' && process.argv[next]) {
      const date = moment(process.argv[next], 'YYYY-MM-DD')
      if (!date.isValid()) {
        console.error('Invalid date')
        process.exit()
      }
      return date
    }
  }
  // TODO stored data is not in UTC?
  // return moment().utc().subtract(1, 'days').startOf('day')
  return moment().subtract(1, 'days').startOf('day')
}

const main = async () => {
  await DB.init()
  const utcTime = getScriptDate()
  const from = moment(utcTime).startOf('day').format('X')
  const to = moment(utcTime).endOf('day').format('X')
  await PublishDiscrepancyReport({ from, to })
  await DB.close()
}

main()
