import '../../../env'
import moment from 'moment'
import winston from 'winston'
import path from 'path'
import fs from 'fs'
import Sequelize from 'sequelize'

import DB from '../../DB/'
import GetSSPData from './GetSSPData'
import { fetch as fetchAsData } from './GetASData'
import GetLogsDir from '../../components/Log/GetLogsDir'

const configLogger = () => {
  const LOGS_DIR = GetLogsDir()
  const now = moment().utc().format('YYYY-MM-DD-HH-mm-ss')
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR)
  }
  const LAST_LOG_PATH = path.join(LOGS_DIR, 'reports-fetch-last.log')
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
        filename: path.join(LOGS_DIR, `reports-fetch-error.${now}.log`),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(LOGS_DIR, `reports-fetch-info.${now}.log`),
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
  // Example: --sspList freewheel,aerserv,onevideo
  // Example: --skipSsp
  const sspOptions = new Set([
    '_empty_',
    'telaria',
    'freewheel',
    'beachfront',
    'aerserv',
    'onevideo'
  ])
  for (let i in process.argv) {
    if (process.argv[i] === '--skipSsp') {
      return new Set()
    }
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
  // Example: --skipAs
  const asOptions = new Set([
    'streamrail',
    'lkqd',
    'aniview',
    'springserve'
  ])
  for (let i in process.argv) {
    if (process.argv[i] === '--skipAs') {
      return new Set()
    }
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

const main = async () => {
  configLogger()
  winston.profile('fetch-duration')
  const utcTime = getTargetDate()
  const sspList = getSspSet()
  const asList = getAsSet()
  winston.info('Fetch script configuration', {
    utcTime: utcTime.format('YYYY-MM-DD'),
    sspList,
    asList
  })

  await DB.init()

  const sspResults = await GetSSPData(utcTime, sspList)
  const asResults = await fetchAsData(utcTime, asList, false)
  winston.verbose('Results', {
    sspResults,
    asResults
  })

  const deleteRange = [
    moment(utcTime).startOf('day').toDate(),
    moment(utcTime).endOf('day').toDate()
  ]
  // Clear SSP existing records for this day
  try {
    const deleted = await DB.models.SspData.destroy({
      where: {
        date: {
          [Sequelize.Op.between]: deleteRange
        },
        key: {
          [Sequelize.Op.in]: Array.from(sspList)
        }
      }
    })
    winston.info('Clear existing SSP records', {
      deleteRange,
      deleted
    })
  } catch (e) {
    winston.error('Clear SSP existing records error', {
      error: e.message
    })
  }
  // Clear AS existing records for this day
  try {
    const deleted = await DB.models.AsData.destroy({
      where: {
        date: {
          [Sequelize.Op.between]: deleteRange
        },
        key: {
          [Sequelize.Op.in]: Array.from(asList)
        }
      }
    })
    winston.info('Clear existing AS records', {
      deleteRange,
      deleted
    })
  } catch (e) {
    winston.error('Clear AS existing records error', {
      error: e.message
    })
  }

  // Store SSP data
  const storeSspData = []
  for (let r of sspResults) {
    for (let d of r.data) {
      storeSspData.push({
        date: utcTime,
        key: r.key,
        ...d
      })
    }
  }
  try {
    await DB.models.SspData.bulkCreate(storeSspData)
    winston.info('Store SSP done', { created: storeSspData.length })
  } catch (e) {
    winston.error('Store SSP error', {
      error: e.message
    })
  }

  // Store AS data
  const storeAsData = []
  for (let r of asResults) {
    for (let d of r.data) {
      storeAsData.push({
        date: utcTime,
        key: r.key,
        tag: d.tag,
        opp: d.asOpp,
        imp: d.asImp,
        rev: d.asRev,
        cost: d.asCost,
        sCost: d.asScost
      })
    }
  }
  try {
    await DB.models.AsData.bulkCreate(storeAsData)
    winston.info('Store AS done', { created: storeAsData.length })
  } catch (e) {
    winston.error('Store AS error', {
      error: e.message
    })
  }

  await DB.close()
  winston.profile('fetch-duration')
  winston.info('Fetch finish')
}

main()
