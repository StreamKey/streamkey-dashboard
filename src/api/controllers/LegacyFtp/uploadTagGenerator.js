import fs from 'fs'
import ssh2 from 'ssh2'

import { promisify } from 'util'
const SshClient = ssh2.Client

const {
  RAZZLE_LEGACY_USER,
  RAZZLE_LEGACY_PASSWORD,
  RAZZLE_LEGACY_HOST,
  RAZZLE_LEGACY_SSH_KEY
} = process.env

const REMOTE_DESTINATION_PATH = `/home/${RAZZLE_LEGACY_USER}/dev/lkqd/tag-generator-input/input/`

export default fileToUpload => {
  return new Promise((resolve, reject) => {
    const LOCAL_FILE_PATH = fileToUpload.path
    const REMOTE_FULL_FILE_PATH = REMOTE_DESTINATION_PATH + fileToUpload.originalFilename

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
  })
}
