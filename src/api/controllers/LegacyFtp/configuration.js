import fs from 'fs'
import ssh2 from 'ssh2'

const SshClient = ssh2.Client

const {
  RAZZLE_LEGACY_USER,
  RAZZLE_LEGACY_PASSWORD,
  RAZZLE_LEGACY_HOST,
  RAZZLE_LEGACY_SSH_KEY
} = process.env

const REMOTE_DEV_PATH = `/home/${RAZZLE_LEGACY_USER}/dev`

const load = as => {
  return new Promise((resolve, reject) => {
    let REMOTE_DESTINATION_PATH = REMOTE_DEV_PATH
    switch (as) {
      case 'lkqd':
        REMOTE_DESTINATION_PATH += '/lkqd/config/default.json'
        break
      case 'streamrail':
        REMOTE_DESTINATION_PATH += '/streamrail/config/default.json'
        break
      case 'springserve':
        REMOTE_DESTINATION_PATH += '/springserve/config/default.json'
        break
      default:
        return reject(new Error('unknown-configuration-file'))
    }
    const conn = new SshClient()
    conn.on('ready', () => {
      conn.sftp(async (err, sftp) => {
        if (err) {
          return reject(err)
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
            return reject(e)
          })
          stream.on('end', () => {
            conn.end()
            const json = JSON.parse(data)
            return resolve(json)
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

const save = (as, jsonData) => {
  return new Promise((resolve, reject) => {
    const strData = JSON.stringify(jsonData, null, 2)
    let REMOTE_DESTINATION_PATH = REMOTE_DEV_PATH
    switch (as) {
      case 'lkqd':
        REMOTE_DESTINATION_PATH += '/lkqd/config/default.json'
        break
      case 'streamrail':
        REMOTE_DESTINATION_PATH += '/streamrail/config/default.json'
        break
      case 'springserve':
        REMOTE_DESTINATION_PATH += '/springserve/config/default.json'
        break
      default:
        return reject(new Error('unknown-configuration-file'))
    }
    const conn = new SshClient()
    conn.on('ready', () => {
      conn.sftp(async (err, sftp) => {
        if (err) {
          return reject(err)
        }
        try {
          const REMOTE_DESTINATION_BACKUP_PATH = REMOTE_DESTINATION_PATH + '.backup'
          sftp.unlink(REMOTE_DESTINATION_BACKUP_PATH, err => {
            if (err && err.message !== 'No such file') {
              return reject(err)
            }
            sftp.rename(REMOTE_DESTINATION_PATH, REMOTE_DESTINATION_BACKUP_PATH, err => {
              if (err) {
                return reject(err)
              }
              sftp.open(REMOTE_DESTINATION_PATH, 'w', (err, fd) => {
                if (err) {
                  return reject(err)
                }
                const buf = Buffer.from(strData, 'utf8')
                sftp.write(fd, buf, 0, buf.length, 0, err => {
                  if (err) {
                    return reject(err)
                  }
                  sftp.close(fd, () => {
                    resolve()
                  })
                })
              })
            })
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

export default {
  load,
  save
}
