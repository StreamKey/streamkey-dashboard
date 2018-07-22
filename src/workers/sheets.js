import '../../env'

import moment from 'moment'

import { init, listFiles, deleteFile, createFolder, shareFile } from '../api/controllers/Google/Sheets'
import DB from '../DB'
import PublishDiscrepancyReport from '../api/controllers/Google/PublishDiscrepancyReport'

const main = async () => {
  await init()
  // await DB.init()
  // const utcTime = moment().utc().subtract(1, 'days').startOf('day')
  // const from = Number(moment(utcTime).startOf('day').format('X'))
  // const to = Number(moment(utcTime).endOf('day').format('X'))
  // await PublishDiscrepancyReport({ from, to })
  // await DB.close()

  // const folderId = await createFolder('folder name')
  // await deleteFile({ fileId: 'ab12' })
  // await shareFile({ fileId: 'ab12' })
}

main()
