import '../../../env'
import _ from 'lodash'
import moment from 'moment'
import winston from 'winston'
import path from 'path'
import fs from 'fs'
import Sequelize from 'sequelize'

import DB from '../../DB/'
import GetLogsDir from '../../components/Log/GetLogsDir'
import { groupAsResults } from './GetASData'
import MergeTags from './MergeTags'
import CalcProfit from './CalcProfit'
import EmailResults from './EmailResults'

const configLogger = () => {
  const LOGS_DIR = GetLogsDir()
  const now = moment().utc().format('YYYY-MM-DD-HH-mm-ss')
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR)
  }
  const LAST_LOG_PATH = path.join(LOGS_DIR, 'reports-build-last.log')
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
        filename: path.join(LOGS_DIR, `reports-build-error.${now}.log`),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(LOGS_DIR, `reports-build-info.${now}.log`),
        level: 'info'
      }),
      new winston.transports.File({
        filename: LAST_LOG_PATH
      })
    ]
  })
}

const getTargetDate = () => {
  // Get the date argument the script will fetch data for
  // Default: yesterday
  for (let i in process.argv) {
    const next = Number(i) + 1
    if (process.argv[i] === '--date' && process.argv[next]) {
      const date = moment(process.argv[next] + ' 0:00 +0000', 'YYYY-MM-DD HH:mm Z').utc()
      if (!date.isValid()) {
        console.error('Invalid date')
        process.exit(1)
      }
      return date
    }
  }
  return moment().utc().subtract(1, 'days').startOf('day')
}

const getSspSet = () => {
  // Get the list of SSPs to fetch data from (comma separated)
  // Default: All
  // Example: --sspList freewheel,aerserv
  const sspOptions = new Set([
    '_empty_',
    'telaria',
    'freewheel',
    'beachfront',
    'aerserv',
    'improvedigital',
    'tappx'
  ])
  for (let i in process.argv) {
    const next = Number(i) + 1
    if (process.argv[i] === '--sspList' && process.argv[next]) {
      const sspList = process.argv[next].split(',')
      for (let ssp of sspList) {
        if (!sspOptions.has(ssp)) {
          console.error('Invalid SSP', ssp)
          process.exit(1)
        }
      }
      return new Set(sspList)
    }
  }
  return sspOptions
}

const getAsSet = () => {
  // Get the list of ASs to fetch data from (comma separated)
  // Default: All
  // Example: --asList streamrail,lkqd
  const asOptions = new Set([
    'streamrail',
    'lkqd',
    'aniview',
    'springserve'
  ])
  for (let i in process.argv) {
    const next = Number(i) + 1
    if (process.argv[i] === '--asList' && process.argv[next]) {
      const asList = process.argv[next].split(',')
      for (let as of asList) {
        if (!asOptions.has(as)) {
          console.error('Invalid AS', as)
          process.exit(1)
        }
      }
      return new Set(asList)
    }
  }
  return asOptions
}

const getSspData = async (dateRange, sspList) => {
  // Fetch from DB
  const sspRecords = await DB.models.SspData.findAll({
    where: {
      date: {
        [Sequelize.Op.between]: dateRange
      },
      key: {
        [Sequelize.Op.in]: Array.from(sspList)
      }
    }
  })

  // Group by SSP
  const groupedSspRecords = {}
  _.each(sspRecords, r => {
    const record = r.dataValues
    if (!groupedSspRecords[record.key]) {
      groupedSspRecords[record.key] = []
    }
    groupedSspRecords[record.key].push({
      tag: record.tag,
      opp: record.opp,
      imp: record.imp,
      rev: Number(record.rev),
      sCost: Number(record.sCost)
    })
  })

  // Convert to array
  const sspResults = []
  _.each(groupedSspRecords, (v, k) => {
    sspResults.push({
      key: k,
      data: v
    })
  })

  return sspResults
}

const getAsData = async (dateRange, asList) => {
  const asRecords = await DB.models.AsData.findAll({
    where: {
      date: {
        [Sequelize.Op.between]: dateRange
      },
      key: {
        [Sequelize.Op.in]: Array.from(asList)
      }
    }
  })

  const groupedAsRecords = {}
  _.each(asRecords, r => {
    const record = r.dataValues
    if (!groupedAsRecords[record.key]) {
      groupedAsRecords[record.key] = []
    }
    groupedAsRecords[record.key].push({
      tag: record.tag,
      asOpp: record.opp,
      asImp: record.imp,
      asRev: Number(record.rev),
      asCost: Number(record.cost),
      asScost: Number(record.sCost)
    })
  })

  const asResults = []
  _.each(groupedAsRecords, (data, key) => {
    asResults.push({
      key,
      data: groupAsResults(data, key)
    })
  })

  return asResults
}

const main = async () => {
  configLogger()
  const utcTime = getTargetDate()
  const sspList = getSspSet()
  const asList = getAsSet()
  winston.info('Script configuration', {
    utcTime: utcTime.format('YYYY-MM-DD'),
    sspList,
    asList
  })

  await DB.init()

  const dateRange = [
    moment(utcTime).startOf('day').toDate(),
    moment(utcTime).endOf('day').toDate()
  ]
  const sspResults = await getSspData(dateRange, sspList)
  const asResults = await getAsData(dateRange, asList)

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
        date: {
          [Sequelize.Op.between]: dateRange
        }
      }
    })
    winston.info('Clear existing Reports records', {
      deleteRange: dateRange,
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

  try {
    await EmailResults.send({ utcTime })
    winston.info('Email sent successfully')
  } catch (e) {
    winston.error('Send email failed', {
      error: e.message
    })
  }

  await DB.close()
  winston.info('Create report finish')

  // TODO figure out which handle prevents from exiting in dev
  setTimeout(() => {
    process.exit()
  }, 1000)
}

main()
