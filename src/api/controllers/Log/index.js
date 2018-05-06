import path from 'path'
import fs from 'fs'

const LOGS_DIR = path.join(__dirname, '..', '..', '..', '..', 'logs')

const list = () => {
  return new Promise(resolve => {
    fs.readdir(LOGS_DIR, (err, files) => {
      resolve(files)
    })
  })
}

const get = file => {
  return new Promise(resolve => {
    fs.readFile(LOGS_DIR + '/' + file, 'utf8', (err, data) => {
      resolve(data)
    })
  })
}

export default {
  list,
  get
}
