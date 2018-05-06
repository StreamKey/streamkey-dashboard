import fs from 'fs'

import GetLogsDir from '../../../components/Log/GetLogsDir'
const LOGS_DIR = GetLogsDir()

const list = () => {
  return new Promise(resolve => {
    fs.readdir(LOGS_DIR, (err, files) => {
      if (err) {
        throw err
      }
      resolve(files)
    })
  })
}

const get = file => {
  return new Promise(resolve => {
    fs.readFile(LOGS_DIR + '/' + file, 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      resolve(data)
    })
  })
}

export default {
  list,
  get
}
