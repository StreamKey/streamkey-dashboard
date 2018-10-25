import numeral from 'numeral'
import winston from 'winston'
import uniqBy from 'lodash/uniqBy'
import moment from 'moment'

import DB from '../../DB/'
import Email from '../../api/controllers/Email/'
import PublishDiscrepancyReport from '../../api/controllers/Google/PublishDiscrepancyReport'
import PublishSspAsReport from '../../api/controllers/Google/PublishSspAsReport'
import GetFetchErrorLogs from '../../components/Log/GetFetchErrorLogs'

const { RAZZLE_REPORT_SCRIPT_EMAIL_RECEPIENTS } = process.env

const getLoggerData = utcTime => {
  return new Promise(async (resolve, reject) => {
    const errors = []
    const warns = []

    // Get all fetch-error logs of the relevant day
    const fetchErrors = await GetFetchErrorLogs(utcTime)
    for (let e of fetchErrors) {
      errors.push(e)
    }

    let items, first
    try {
      // This is a hack to read the current log, as winston.query() is not working
      // properly. Watch https://github.com/winstonjs/winston/issues/1130
      winston.stream({ start: -1 })
        .on('log', log => {
          if (!first) {
            first = log
          }
          if (log.level === 'error') {
            errors.push(log)
          } else if (log.level === 'warn') {
            warns.push(log)
          } else if (log.message === 'Items to store') {
            items = log.items
          }
        })
      setTimeout(() => {
        const now = moment()
        const firstLog = moment(first.timestamp)
        const runDuration = moment.duration(now.diff(firstLog)).seconds()
        resolve({
          errors: uniqBy(errors, e => '' + e.error + e.message),
          warns: uniqBy(warns, e => '' + e.message + JSON.stringify(e.data)),
          runDuration,
          items
        })
      }, 2000)
    } catch (e) {
      console.error(e)
      reject(e)
    }
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
      const partner = error.ssp || error.as || error.asKey || false
      return (partner ? partner + ' ' : '') + error.error + (error.prevError ? '. ' + error.prevError : '')
  }
}

const getItemsAboveThreshold = items => {
  return items.filter(i => {
    return (i.profit <= -20) || (i.profit >= 100 && i.margin < 0.15)
  })
}

const getEmailBody = ({ utcTime, loggerData, reportsUrls }) => {
  const date = utcTime.format('YYYY-MM-DD')
  const itemsAboveThreshold = getItemsAboveThreshold(loggerData.items)
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

  if (itemsAboveThreshold.length > 0) {
    text += '\nTags above threshold:\n'
    html += `<br/><b>Tags above threshold:</b><table>
    <tr><td><b>Tag</b></td><td><b>Profit</b></td><td><b>Margin</b></td></tr>`
    for (let i of itemsAboveThreshold) {
      const profit = numeral(i.profit).format('$0,0.0')
      const margin = numeral(i.margin).format('0a%')
      text += `${i.tag}, ${profit}, ${margin}` + '\n'
      html += `<tr><td>${i.tag}</td><td>${profit}</td><td>${margin}</td></tr>`
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
  try {
    const loggerData = await getLoggerData(utcTime)
    const reportsUrls = await generateReports(utcTime)
    await saveReportUrl({ utcTime, loggerData, reportsUrls })
    const emailBody = getEmailBody({ utcTime, loggerData, reportsUrls })
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
