import fs from 'fs'
import path from 'path'
import ssh2 from 'ssh2'

import { promisify } from 'util'
const SshClient = ssh2.Client

const {
  RAZZLE_LEGACY_USER,
  RAZZLE_LEGACY_PASSWORD,
  RAZZLE_LEGACY_HOST,
  RAZZLE_LEGACY_SSH_KEY
} = process.env

const LOGS_DIR = process.env.RAZZLE_TMP_PATH || path.join(__dirname, '..', '..', '..')

export default action => {
  return new Promise((resolve, reject) => {
    let fileName
    if (action === 'bundle-lkqd') {
      fileName = 'run-empty-lists-bundle.txt'
    } else if (action === 'domain-lkqd') {
      fileName = 'run-empty-lists-domain.txt'
    } else {
      return reject(new Error('invalid-clean-bl-action'))
    }
    const LOCAL_FILE_PATH = path.join(LOGS_DIR, fileName)
    const REMOTE_FULL_FILE_PATH = `/home/${RAZZLE_LEGACY_USER}/dev/lkqd/${fileName}`
    fs.writeFileSync(LOCAL_FILE_PATH, '', 'utf8')
    const conn = new SshClient()
    conn.on('ready', () => {
      conn.sftp(async (err, sftp) => {
        if (err) {
          reject(err)
        }
        const fastPut = promisify(sftp.fastPut.bind(sftp))
        try {
          await fastPut(LOCAL_FILE_PATH, REMOTE_FULL_FILE_PATH)
          fs.unlinkSync(LOCAL_FILE_PATH)
          conn.end()
          resolve(true)
        } catch (e) {
          conn.end()
          fs.unlinkSync(LOCAL_FILE_PATH)
          reject(e)
        }
      })
    }).connect({
      host: RAZZLE_LEGACY_HOST,
      port: 22,
      username: RAZZLE_LEGACY_USER,
      password: RAZZLE_LEGACY_PASSWORD,
      privateKey: fs.readFileSync(RAZZLE_LEGACY_SSH_KEY)
    })
    resolve(true)
  })
}
