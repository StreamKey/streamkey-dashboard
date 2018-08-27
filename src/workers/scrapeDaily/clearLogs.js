import path from 'path'
import fs from 'fs'

import GetLogsDir from '../../components/Log/GetLogsDir'

const NUMBER_OF_LOGS_TO_KEEP = 14

const filePatterns = [
  /^reports-fetch-info\.[\d-]+\.log$/,
  /^reports-fetch-error\.[\d-]+\.log$/,
  /^reports-build-info\.[\d-]+\.log$/,
  /^reports-build-error\.[\d-]+\.log$/,
  /^reports-info\.[\d-]+\.log$/,
  /^reports-error\.[\d-]+\.log$/
]

const deleteFiles = (dir, files) => {
  for (let f of files) {
    const filePath = path.join(dir, f)
    fs.unlinkSync(filePath)
  }
}

const main = () => {
  const LOGS_DIR = GetLogsDir()
  if (!fs.existsSync(LOGS_DIR)) {
    console.error(`Couldn't find the logs directory at ${LOGS_DIR}`)
  }

  const files = fs.readdirSync(LOGS_DIR)

  for (let p of filePatterns) {
    const matchingFiles = []
    for (let f of files) {
      if (p.test(f)) {
        matchingFiles.push(f)
      }
    }
    const numberOfFilesToDelete = Math.max(0, matchingFiles.length - NUMBER_OF_LOGS_TO_KEEP)
    const filesToDelete = matchingFiles.sort().slice(0, numberOfFilesToDelete)
    deleteFiles(LOGS_DIR, filesToDelete)
  }
}

main()
