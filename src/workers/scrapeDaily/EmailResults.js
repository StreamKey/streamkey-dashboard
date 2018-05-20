import Email from '../../api/controllers/Email/'

const { RAZZLE_REPORT_SCRIPT_EMAIL_RECEPIENTS } = process.env

const send = async results => {
  await Email.send({
    to: RAZZLE_REPORT_SCRIPT_EMAIL_RECEPIENTS,
    subject: 'Report is ready',
    text: 'Hello world!',
    html: '<b>Hello world!</b>'
  })
}

export default {
  send
}
