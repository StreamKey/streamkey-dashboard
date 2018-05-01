require('./env.js')

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_SSH_KEY
} = process.env
const ROOT_DIR = '/var/www/streamkey-dashboard'

module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      key: DEPLOY_SSH_KEY,
      deployTo: ROOT_DIR,
      repositoryUrl: 'https://github.com/StreamKey/streamkey-dashboard.git'
    },
    production: {
      servers: `${DEPLOY_USER}@${DEPLOY_HOST}`
    }
  })

  shipit.task('install', async () => {
    const CURRENT_DIR = ROOT_DIR + '/current'
    await shipit.remote(`cp ${ROOT_DIR}/.env ${CURRENT_DIR}/.env`)
    await shipit.remote(`cd ${CURRENT_DIR} && /usr/bin/yarn install`)
    await shipit.remote(`cd ${CURRENT_DIR} && yarn sequelize db:migrate --config src/DB/config.js`)
    await shipit.remote(`cd ${CURRENT_DIR} && /usr/bin/yarn build`)
  })

  shipit.task('restart', async () => {
    await shipit.remote(`sudo ${ROOT_DIR}/current/node_modules/.bin/forever stopall`)
    await shipit.remote(`sudo NODE_ENV=production ${ROOT_DIR}/current/node_modules/.bin/forever start /var/www/streamkey-dashboard/current/build/server.js`)
  })
}
