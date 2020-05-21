import Sequelize from 'sequelize'

import User from './models/user'
import Report from './models/report'
import SspData from './models/sspdata'
import AsData from './models/asdata'
import BackupConfigUI from './models/backupconfigui'
import ReportLink from './models/reportlink'
import Config from './models/config'
import CedatoCosts from './models/cedatocosts'

// Order is important for associations
const modelsDefinitions = [
  User,
  Report,
  SspData,
  AsData,
  BackupConfigUI,
  ReportLink,
  Config,
  CedatoCosts
]

const models = {}

const {
  RAZZLE_PG_HOST,
  RAZZLE_PG_PORT,
  RAZZLE_PG_DB,
  RAZZLE_PG_USER,
  RAZZLE_PG_PASSWORD,
  RAZZLE_DB_LOGGING
} = process.env

const sequelize = new Sequelize(RAZZLE_PG_DB, RAZZLE_PG_USER, RAZZLE_PG_PASSWORD, {
  host: RAZZLE_PG_HOST,
  port: RAZZLE_PG_PORT,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: (message, benchmark) => {
    if (RAZZLE_DB_LOGGING !== 'false') {
      console.log(benchmark, message)
    }
  },
  benchmark: true
})

const init = async () => {
  try {
    await sequelize.authenticate()
  } catch (e) {
    console.error(`Unable to connect to the database on ${RAZZLE_PG_USER}@${RAZZLE_PG_HOST}:${RAZZLE_PG_PORT}: `, e)
    throw e
  }
  for (let m of modelsDefinitions) {
    const model = m(sequelize)
    models[model.getTableName()] = model
    model.sync()
  }
}

const close = async () => {
  await sequelize.close()
}

export default {
  init,
  close,
  models,
  sequelize
}
