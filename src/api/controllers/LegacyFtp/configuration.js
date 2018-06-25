import fs from 'fs'
import ssh2 from 'ssh2'

const SshClient = ssh2.Client

const {
  RAZZLE_LEGACY_USER,
  RAZZLE_LEGACY_PASSWORD,
  RAZZLE_LEGACY_HOST,
  RAZZLE_LEGACY_SSH_KEY
} = process.env

const REMOTE_DESTINATION_PATH = `/home/${RAZZLE_LEGACY_USER}/dev/lkqd/config/default.json`

const load = () => {
  return new Promise((resolve, reject) => {
    const conn = new SshClient()
    conn.on('ready', () => {
      conn.sftp(async (err, sftp) => {
        if (err) {
          reject(err)
        }
        try {
          const stream = sftp.createReadStream(REMOTE_DESTINATION_PATH, {
            encoding: 'utf8'
          })
          let data = ''
          stream.on('data', chunk => {
            data += chunk
          })
          stream.on('error', e => {
            conn.end()
            reject(e)
          })
          stream.on('end', () => {
            conn.end()
            const json = JSON.parse(data)
            resolve(json)
          })
        } catch (e) {
          conn.end()
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

const save = async jsonData => {
  console.log('jsonData', jsonData)
}

export default {
  load,
  save
}
