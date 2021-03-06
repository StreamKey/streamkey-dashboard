import getApp from './getApp'
import getStatus from './getStatus'
import postLogin from './postLogin'
import getLogout from './getLogout'
import getProfile from './getProfile'
import getReport from './getReport'
import getLogs from './getLogs'
import getLog from './getLog'
import postRunLkqdTremorDuplicate from './postRunLkqdTremorDuplicate'
import postCleanBl from './postCleanBl'
import uploadTagGenerator from './uploadTagGenerator'
import getConfigurationUi from './getConfigurationUi'
import postConfigurationUi from './postConfigurationUi'
import postExec from './postExec'
import { notFound, parseError, serverError } from './Errors'

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

// const isAdmin = async req => {
//   throw new Error('not-authorized')
// }

const isLoggedIn = async req => {
  if (req.session && req.session.isLoggedIn === true) {
    return true
  }
  req.session.isLoggedIn = false
  req.session.save()
  throw new Error('not-authorized')
}

const asyncMiddleware = promise => {
  return (req, res) => {
    promise(req)
      .then(data => {
        res.json({
          success: true,
          ...data
        })
      })
      .catch(e => {
        parseError(res, e)
      })
  }
}

const ensureAdmin = (req, res, next) => {
  // isAdmin(req)
  isLoggedIn(req)
    .then(() => {
      next()
    })
    .catch(e => {
      next(e)
    })
}

const ensureLoggedIn = (req, res, next) => {
  isLoggedIn(req)
    .then(() => {
      next()
    })
    .catch(e => {
      next(e)
    })
}

export default app => {
  app.get('/api/status', asyncMiddleware(getStatus))

  app.post('/api/login', asyncMiddleware(postLogin))
  app.get('/api/logout', asyncMiddleware(getLogout))

  app.get('/api/profile', ensureLoggedIn, asyncMiddleware(getProfile))
  app.get('/api/reports/:report', ensureLoggedIn, asyncMiddleware(getReport))
  app.get('/api/logs', ensureLoggedIn, asyncMiddleware(getLogs))
  app.get('/api/logs/:file', ensureLoggedIn, asyncMiddleware(getLog))
  app.post('/api/runLkqdTremorDuplicate/:action', ensureLoggedIn, asyncMiddleware(postRunLkqdTremorDuplicate))
  app.post('/api/cleanBl/:action', ensureLoggedIn, asyncMiddleware(postCleanBl))
  app.put('/api/uploadTagGenerator', ensureLoggedIn, multipartMiddleware, asyncMiddleware(uploadTagGenerator))
  app.get('/api/thresholds/load/:as', ensureLoggedIn, asyncMiddleware(getConfigurationUi))
  app.post('/api/thresholds/save/:as', ensureLoggedIn, asyncMiddleware(postConfigurationUi))
  app.post('/api/exec/:script', ensureLoggedIn, asyncMiddleware(postExec))

  app.use('/api/admin/*', ensureAdmin)

  app.get('/api/*', notFound)
  app.use(serverError)

  app.get('/*', getApp)
}
