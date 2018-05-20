import nodemailer from 'nodemailer'

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
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      resolve()
    })
  })
}

export default {
  send
}
