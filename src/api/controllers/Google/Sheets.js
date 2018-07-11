// Assumes env var GOOGLE_APPLICATION_CREDENTIALS points to service account credentials

const { google } = require('googleapis')
const _ = require('lodash')
_.mixin(require('lodash-deep'))
const FOLDER_ID = '1OT7UPDnjNSq6zDrUBH3wntPHo5xF5BcU'
let auth,
  drive,
  sheets

const publishReport = async ({ filename, sheetTitle, data, formatData }) => {
  await init()
  let fileId = '1pALaGub8D2VFthH7KEF5zuIobIPBHqjWSvBuYtDXEGc'
  // let fileId
  // const existingFiles = await listFiles({ query: filename, exact: true })
  // if (existingFiles.length === 1 && existingFiles[0].name === filename) {
  //   console.log('Found existing file', existingFiles[0].id)
  //   fileId = existingFiles[0].id
  // } else {
  //   console.log('Creating new file')
  //   fileId = await createNewSheet({ filename })
  //   await moveFileToSharedFolder({ fileId })
  // }

  console.log('Using ' + fileId)
  writeToSheet({ fileId, sheetTitle, data, formatData })

  // await listFiles({ drive })
  // await deleteFile({ drive, fileId: 'ab12' })
  // await createFolder({ drive })
  // await shareFile({ drive, fileId: 'ab12' })
}

const init = async () => {
  if (auth) {
    return
  }
  auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ]
  })
  drive = google.drive({ version: 'v3', auth })
  sheets = google.sheets({ version: 'v4', auth })
}

const deleteFile = ({ fileId }) => {
  return drive.files.delete({ fileId })
}

const listFiles = async ({ query, exact }) => {
  const listRes = await drive.files.list({
    query
  })
  if (query && exact) {
    for (let f of listRes.data.files) {
      if (f.name === query) {
        return [f]
      }
    }
  }
  return listRes.data.files
}

const createFolder = async () => {
  const res = await drive.files.create({
    resource: {
      name: 'Dashboard Reports',
      mimeType: 'application/vnd.google-apps.folder'
    }
  })
  console.log(res)
}

const createNewSheet = async ({ filename }) => {
  const request = {
    resource: {
      properties: {
        title: filename
      }
    }
  }
  const res = await sheets.spreadsheets.create(request)
  return res.data.spreadsheetId
}

const writeToSheet = async ({ fileId, sheetTitle, data, formatData }) => {
  // Create new sheet
  const sheetRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: fileId,
    resource: {
      requests: [{
        addSheet: {
          properties: {
            index: 0,
            title: sheetTitle
          }
        }
      }]
    }
  })
  const sheetId = sheetRes.data.replies[0].addSheet.properties.sheetId
  console.log('sheetId', sheetId)

  // Add data
  const dataRequest = {
    spreadsheetId: fileId,
    range: `${sheetTitle}!A1:ZZ99999`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      majorDimension: 'ROWS',
      values: data
    }
  }
  const res = await sheets.spreadsheets.values.update(dataRequest)
  console.log(res.data)

  // Add format
  const mappedFormatData = _.deepMapValues(formatData, (v, path) => {
    if (v === '__sheetId__') {
      return sheetId
    } else {
      return v
    }
  })
  const formatRequest = {
    spreadsheetId: fileId,
    resource: {
      requests: mappedFormatData
    }
  }
  const res2 = await sheets.spreadsheets.batchUpdate(formatRequest)
  console.log(res2.data)
}

const shareFile = async ({ fileId }) => {
  const res = await drive.permissions.create({
    fileId,
    resource: {
      role: 'writer',
      type: 'domain',
      domain: 'streamkey.tv'
    }
  })
  console.log(res)
}

const moveFileToSharedFolder = async ({ fileId }) => {
  await drive.files.update({
    fileId,
    addParents: [FOLDER_ID]
  })
}

module.exports = {
  init,
  publishReport,
  createNewSheet,
  createFolder,
  shareFile,
  moveFileToSharedFolder
}
