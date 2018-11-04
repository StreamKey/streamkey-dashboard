const notFound = (req, res) => {
  parseError(res, new Error('no-such-route'))
}

const serverError = (err, req, res, next) => {
  parseError(res, err)
}

const errors = {
  'unhandled-error': {
    id: 10,
    code: 500,
    message: 'Server side error'
  },
  'no-such-route': {
    id: 11,
    code: 404,
    message: 'No such route'
  },
  'not-authorized': {
    id: 12,
    code: 403,
    message: 'You are not authorized to make this request'
  },
  'invalid-input': {
    id: 13,
    code: 400,
    message: 'The provided parameters are invalid'
  },
  'user-not-found': {
    id: 14,
    code: 404,
    message: 'User not found'
  },
  'user-already-exists': {
    id: 15,
    code: 400,
    message: 'User already exists'
  },
  'user-already-verified': {
    id: 15,
    code: 400,
    message: 'User already verified'
  },
  'invalid-credentials': {
    id: 16,
    code: 400,
    message: 'Invalid credentials'
  },
  'no-such-report': {
    id: 17,
    code: 404,
    message: 'This type of report does not exist'
  },
  'spotx-oauth-token-error': {
    id: 18,
    code: 400,
    message: 'SpotX OAuth token request failed'
  },
  'unknown-configuration-file': {
    id: 19,
    code: 404,
    message: 'No such configuration file'
  },
  'unknown-exec-script': {
    id: 20,
    code: 404,
    message: 'No such script'
  },
  'fetch-data-missing-as': {
    id: 21,
    code: 400,
    message: 'Missing AS field'
  },
  'fetch-data-missing-ssp': {
    id: 22,
    code: 400,
    message: 'Missing SSP field'
  },
  'fetch-data-missing-date': {
    id: 23,
    code: 400,
    message: 'Missing date field'
  },
  'fetch-data-invalid-input': {
    id: 24,
    code: 400,
    message: 'Invalid input'
  }
}

const findError = err => {
  if (err.noCatch === true) {
    return {
      id: 500,
      code: 400,
      message: err.message
    }
  }
  if (errors[err.message]) {
    return errors[err.message]
  }
  return errors['unhandled-error']
}

const parseError = (res, err) => {
  const error = findError(err)
  if (error.code >= 500) {
    console.error(err.stack)
  }
  res.status(error.code).json({
    success: false,
    error: {
      id: error.id,
      message: error.message,
      ...err.details
    }
  })
}

export {
  notFound,
  serverError,
  parseError
}
