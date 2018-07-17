import '../../../env'
import moment from 'moment'
import winston from 'winston'
import path from 'path'
import fs from 'fs'

import DB from '../../DB/'
import GetSSPData from './GetSSPData'
import GetASData from './GetASData'
import MergeTags from './MergeTags'
import CalcProfit from './CalcProfit'
import EmailResults from './EmailResults'
import GetLogsDir from '../../components/Log/GetLogsDir'

const configLogger = () => {
  const LOGS_DIR = GetLogsDir()
  const now = moment().utc().format('YYYY-MM-DD-HH-mm-ss')
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR)
  }
  const LAST_LOG_PATH = path.join(LOGS_DIR, 'reports-last-run.log')
  if (fs.existsSync(LAST_LOG_PATH)) {
    fs.truncateSync(LAST_LOG_PATH)
  }
  winston.configure({
    level: 'silly',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(LOGS_DIR, `reports-error.${now}.log`),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(LOGS_DIR, `reports-info.${now}.log`),
        level: 'info'
      }),
      new winston.transports.File({
        filename: LAST_LOG_PATH
      })
    ]
  })
}

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
  return moment().utc().subtract(1, 'days').startOf('day')
}

const main = async () => {
  configLogger()
  winston.profile('run-duration')
  const utcTime = getScriptDate()
  winston.info('Script time (UTC)', {
    time: utcTime.format('YYYY-MM-DD')
  })

  await DB.init()

  const sspResults = await GetSSPData(utcTime)
  const asResults = await GetASData(utcTime)
  winston.verbose('Final Results', {
    sspResults,
    asResults
  })

  // Match tags
  const merged = MergeTags(sspResults, asResults)
  const itemsToStore = CalcProfit(merged, utcTime)
  winston.verbose('Items to store', {
    items: itemsToStore
  })
  winston.info('Number of items to store', {
    count: itemsToStore.length
  })

  // Clear existing records for this day
  try {
    const deleted = await DB.models.Reports.destroy({
      where: {
        date: utcTime
      }
    })
    winston.info('Clear existing records', {
      date: utcTime.format('YYYY-MM-DD'),
      deleted
    })
  } catch (e) {
    winston.error('Clear existing records error', {
      error: e.message
    })
  }

  // Store data
  const storeJobs = itemsToStore.map(async item => {
    await DB.models.Reports.upsert(item)
  })
  try {
    await Promise.all(storeJobs)
    winston.info('Store report done')
  } catch (e) {
    winston.error('Store report error', {
      error: e.message
    })
  }

  winston.profile('run-duration')
  try {
    await EmailResults.send({ utcTime })
    winston.info('Email sent')
  } catch (e) {
    winston.error('Send email failed', {
      error: e.message
    })
  }

  await DB.close()
  winston.info('Script finish')
}

main()
