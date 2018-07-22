// Assumes env var GOOGLE_APPLICATION_CREDENTIALS points to service account credentials

const { google } = require('googleapis')
const _ = require('lodash')
_.mixin(require('lodash-deep'))
const FOLDER_ID = process.env.GOOGLE_DRIVE_REPORTS_FOLDER || '1OT7UPDnjNSq6zDrUBH3wntPHo5xF5BcU'
let auth,
  drive,
  sheets

const publishReport = async ({ filename, sheetTitle, data, formatData }) => {
  await init()

  let fileId
  const existingFiles = await listFiles({ query: `name = '${filename}' and '${FOLDER_ID}' in parents` })
  if (existingFiles.length === 1 && existingFiles[0].name === filename) {
    // Found existing file
    fileId = existingFiles[0].id
  } else {
    // Creating a new file
    fileId = await createNewSheet({ filename })
    await moveFileToSharedFolder({ fileId })
  }
  await writeToSheet({ fileId, sheetTitle, data, formatData })

  const fileUrl = `https://docs.google.com/spreadsheets/d/${fileId}`
  return fileUrl
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

const listFiles = async ({ query }) => {
  // https://developers.google.com/drive/api/v3/search-parameters
  // https://developers.google.com/drive/api/v3/reference/query-ref
  const listRes = await drive.files.list({
    q: query
  })
  return listRes.data.files
}

const createFolder = async (folderName = 'Dashboard Reports') => {
  const res = await drive.files.create({
    resource: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    }
  })
  return res.data.id
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
  await sheets.spreadsheets.values.update(dataRequest)

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
  await sheets.spreadsheets.batchUpdate(formatRequest)
}

const shareFile = async ({ fileId }) => {
  await drive.permissions.create({
    fileId,
    resource: {
      role: 'writer',
      type: 'domain',
      domain: 'streamkey.tv'
    }
  })
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
  listFiles,
  deleteFile,
  moveFileToSharedFolder
}
