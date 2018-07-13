import '../../../env'
import moment from 'moment'

import DB from '../../DB/'

import PublishDiscrepancyReport from '../../api/controllers/Google/PublishDiscrepancyReport'

const main = async () => {
  await DB.init()
  const from = moment('2018-07-14').startOf('day').format('X')
  const to = moment('2018-07-14').endOf('day').format('X')
  await PublishDiscrepancyReport({ from, to })
  await DB.close()
}

main()
