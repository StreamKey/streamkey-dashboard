require('./env.js')

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_SSH_KEY
} = process.env

module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      key: DEPLOY_SSH_KEY,
      deployTo: '/var/www/streamkey-dashboard',
      repositoryUrl: 'https://github.com/StreamKey/streamkey-dashboard.git'
    },
    production: {
      servers: `${DEPLOY_USER}@${DEPLOY_HOST}`
    }
  })
}
