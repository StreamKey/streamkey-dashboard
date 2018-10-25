import fs from 'fs'
import path from 'path'
import glob from 'glob'

import GetLogsDir from './GetLogsDir'
const LOGS_DIR = GetLogsDir()

export default utcTime => {
  return new Promise((resolve, reject) => {
    const combinedLogs = []
    const errorLogPattern = 'reports-fetch-error.' + utcTime.format('YYYY-MM-DD') + '-*'
    const fetchErrorFiles = glob.sync(path.join(LOGS_DIR, errorLogPattern))
    for (let f of fetchErrorFiles) {
      const log = fs.readFileSync(f, 'utf8')
      const lines = log.split('\n')
      for (let l of lines) {
        if (l.length === 0) {
          continue
        }
        try {
          const json = JSON.parse(l)
          combinedLogs.push(json)
        } catch (e) {
          console.log('Non JSON line in log', l)
        }
      }
    }
    resolve(combinedLogs)
  })
}
