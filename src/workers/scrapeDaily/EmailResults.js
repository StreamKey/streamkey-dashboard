import numeral from 'numeral'
import winston from 'winston'
import get from 'lodash/get'
import pick from 'lodash/pick'
import uniqBy from 'lodash/uniqBy'
import moment from 'moment'

import DB from '../../DB/'
import Email from '../../api/controllers/Email/'
import PublishDiscrepancyReport from '../../api/controllers/Google/PublishDiscrepancyReport'
import PublishSspAsReport from '../../api/controllers/Google/PublishSspAsReport'

const { RAZZLE_REPORT_SCRIPT_EMAIL_RECEPIENTS } = process.env

const getLoggerData = () => {
  return new Promise((resolve, reject) => {
    winston.query({ limit: 999 }, function (err, results) {
      if (err) {
        reject(err)
      }
      const errors = []
      const warns = []
      let runDuration, items
      for (let r of results.file) {
        if (r.level === 'error') {
          errors.push(r)
        } else if (r.level === 'warn') {
          warns.push(r)
        } else if (r.message === 'run-duration') {
          runDuration = r.durationMs / 1000
        } else if (r.message === 'Items to store') {
          items = r.items
        }
      }
      resolve({
        errors: uniqBy(errors, e => '' + e.error + e.message),
        warns: uniqBy(warns, e => '' + e.message + JSON.stringify(e.data)),
        runDuration,
        items
      })
    })
  })
}

const sumProfit = items => {
  const ssp = {}
  let total = 0
  for (let i of items) {
    let sspKey = i.ssp
    if (i.ssp === null) {
      sspKey = '_empty_'
    }
    if (!ssp[sspKey]) {
      ssp[sspKey] = {}
    }
    if (!ssp[sspKey][i.as]) {
      ssp[sspKey][i.as] = 0
    }
    ssp[sspKey][i.as] += i.profit
    total += i.profit
  }
  return {
    total,
    ssp
  }
}

const getErrorData = error => {
  switch (error.message) {
    case 'Invalid Tag Group':
      return error.asKey
        ? error.asKey + ': ' + error.tag
        : error.ssp + ': ' + error.tag
    case 'Invalid SSP Tag':
      return error.ssp + ': ' + error.sspData.tag
    case 'Tag Error':
      return (error.ssp ? error.ssp : error.as) + ': ' + error.tag
    default:
      return ''
  }
}

const getEmailBody = ({ utcTime, loggerData, reportsUrls }) => {
  const date = utcTime.format('YYYY-MM-DD')
  const profits = sumProfit(loggerData.items)
  let text, html
  text = `Date: ${date}
Total profit: ${numeral(profits.total).format('$0,0')}
Total records: ${loggerData.items.length}
Errors: ${loggerData.errors.length}
Warnings: ${loggerData.warns.length}`
  html = `<table>
<tr><td>Date</td><td>${date}</td></tr>
<tr><td>Total profit</td><td>${numeral(profits.total).format('$0,0')}</td></tr>
<tr><td>Total records</td><td>${loggerData.items.length}</td></tr>
<tr><td>Errors</td><td>${loggerData.errors.length}</td></tr>
<tr><td>Warnings</td><td>${loggerData.warns.length}</td></tr>
</table>`

  text += `
Discrepancy/SSP-AS Reports: ${reportsUrls.discrepancyUrl}
`
  html += `<br/><b>Discrepancy/SSP-AS Reports:</b><br/>
  <a href="${reportsUrls.discrepancyUrl}">Google Sheets</a>
  <br/>
`

  text += '\nProfit breakdown:\n'
  html += '<br/><b>Profit breakdown:</b><table>'
  for (let ssp in profits.ssp) {
    for (let as in profits.ssp[ssp]) {
      const profit = numeral(profits.ssp[ssp][as]).format('$0,0.0')
      text += `${ssp === '_empty_' ? 'v2v ' + as : ssp} - ${as}: ${profit}` + '\n'
      html += `<tr><td>${ssp === '_empty_' ? 'v2v ' + as : ssp}</td><td>${as}</td><td>${profit}<td></tr>`
    }
  }
  html += '</table>'

  if (loggerData.errors.length > 0) {
    text += '\nErrors:\n'
    html += '<br/><b>Errors:</b><table>'
    for (let e of loggerData.errors) {
      const errorData = getErrorData(e)
      text += `${e.message}` + '\n'
      html += `<tr><td>- ${e.message}: </td><td>${errorData}</td></tr>`
    }
    html += '</table>'
  }

  if (loggerData.warns.length > 0) {
    text += '\nWarnings:\n'
    html += '<br/><b>Warnings:</b><table>'
    for (let e of loggerData.warns) {
      console.log(e)
      const errorData = getErrorData(e)
      text += `${e.message}` + '\n'
      html += `<tr><td>- ${e.message}: </td><td>${errorData}</td></tr>`
    }
    html += '</table>'
  }

  return {
    text,
    html
  }
}

const generateReports = async (utcTime) => {
  const from = Number(moment(utcTime).startOf('day').format('X'))
  const to = Number(moment(utcTime).endOf('day').format('X'))
  winston.info('Generating reports', { from, to })
  let discrepancyUrl
  try {
    discrepancyUrl = await PublishDiscrepancyReport({ from, to })
    await PublishSspAsReport({ from, to })
    winston.info('Discrepancy report done', { url: discrepancyUrl })
  } catch (e) {
    winston.error('Generating discrepancy report failed', { error: e.message })
  }
  return {
    discrepancyUrl
  }
}

const saveReportUrl = async ({ utcTime, reportsUrls }) => {
  await DB.models.ReportLinks.create({
    date: utcTime,
    url: reportsUrls.discrepancyUrl
  })
  winston.info('Saved sheet URL to DB', { date: utcTime, url: reportsUrls.discrepancyUrl })
}

const send = async ({ utcTime }) => {
  const loggerData = await getLoggerData()
  const reportsUrls = await generateReports(utcTime)
  await saveReportUrl({ utcTime, loggerData, reportsUrls })
  const emailBody = getEmailBody({ utcTime, loggerData, reportsUrls })
  try {
    await Email.send({
      to: RAZZLE_REPORT_SCRIPT_EMAIL_RECEPIENTS,
      subject: 'Daily Report - ' + utcTime.format('YYYY-MM-DD'),
      text: emailBody.text,
      html: emailBody.html
    })
  } catch (e) {
    throw e
  }
}

export default {
  send
}
