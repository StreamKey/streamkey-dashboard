// Assumes env var GOOGLE_APPLICATION_CREDENTIALS points to service account credentials

const { google } = require('googleapis')
const FOLDER_ID = '1OT7UPDnjNSq6zDrUBH3wntPHo5xF5BcU'
let auth,
  drive,
  sheets

const main = async () => {
  await init()

  const filename = 'Report-2018-07-10'

  let fileId
  const existingFiles = await listFiles({ query: filename, exact: true })
  if (existingFiles.length === 1 && existingFiles[0].name === filename) {
    console.log('Found existing file', existingFiles[0].id)
    fileId = existingFiles[0].id
  } else {
    console.log('Creating new file')
    fileId = await createNewSheet({ filename })
    await moveFileToSharedFolder({ fileId })
  }

  console.log('Using ' + fileId)
  writeToSheet({ fileId, data: [1, 2, 3] })

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

const writeToSheet = async ({ fileId, data }) => {
  const request = {
    spreadsheetId: fileId,
    range: 'Sheet1!A1:C1',
    valueInputOption: 'RAW',
    requestBody: {
      majorDimension: 'ROWS',
      values: [
        ['A', 'B', 'C']
      ]
    }
  }
  const res = await sheets.spreadsheets.values.update(request)
  console.log(res.data)
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

main().catch(console.error)

// export default {
//   init,
//   createNewSheet,
//   createFolder,
//   shareFile,
//   moveFileToSharedFolder
// }
