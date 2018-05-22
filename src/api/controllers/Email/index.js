import nodemailer from 'nodemailer'

// TODO REMOVE WHEN FIXED
// necessary hacks for winston 3.0.0-rc1..
function clone (obj) {
  var copy = Array.isArray(obj) ? [] : {}
  for (var i in obj) {
    if (Array.isArray(obj[i])) {
      copy[i] = obj[i].slice(0)
    } else if (obj[i] instanceof Buffer) {
      copy[i] = obj[i].slice(0)
    } else if (typeof obj[i] !== 'function') {
      copy[i] = obj[i] instanceof Object ? clone(obj[i]) : obj[i]
    } else if (typeof obj[i] === 'function') {
      copy[i] = obj[i]
    }
  }
  return copy
}
require('winston/lib/winston/common').clone = clone
let Transport = require('winston-transport')
Transport.prototype.normalizeQuery = function (options) {
  options = options || {}
  options.rows = options.rows || options.limit || 10
  options.start = options.start || 0
  options.until = options.until || new Date()
  if (typeof options.until !== 'object') {
    options.until = new Date(options.until)
  }
  options.from = options.from || (options.until - (24 * 60 * 60 * 1000))
  if (typeof options.from !== 'object') {
    options.from = new Date(options.from)
  }
  options.order = options.order || 'desc'
  options.fields = options.fields
  return options
}
Transport.prototype.formatResults = function (results, options) {
  return results
}
// </Hack>

const {
  RAZZLE_EMAIL_HOST,
  RAZZLE_EMAIL_USER,
  RAZZLE_EMAIL_PASS,
  RAZZLE_EMAIL_FROM_NAME,
  RAZZLE_EMAIL_FROM_ADDRESS
} = process.env
const RAZZLE_EMAIL_PORT = Number(process.env.RAZZLE_EMAIL_PORT)

const transporter = nodemailer.createTransport({
  host: RAZZLE_EMAIL_HOST,
  port: RAZZLE_EMAIL_PORT,
  secure: RAZZLE_EMAIL_PORT === 465,
  auth: {
    user: RAZZLE_EMAIL_USER,
    pass: RAZZLE_EMAIL_PASS
  }
})

const send = (options = {}) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"${RAZZLE_EMAIL_FROM_NAME}" <${RAZZLE_EMAIL_FROM_ADDRESS}>`,
      to: 'no-reply@streamkey.tv',
      subject: 'Empty Subject',
      text: 'Empty text',
      html: '<b>Empty HTML</b>',
      ...options
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error)
      }
      resolve(info)
    })
  })
}

export default {
  send
}
