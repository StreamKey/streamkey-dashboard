// Assumes env var GOOGLE_APPLICATION_CREDENTIALS points to service account credentials

const { google } = require('googleapis')
const FOLDER_ID = 'ab12'

const main = async () => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ]
  })

  const drive = google.drive({ version: 'v3', auth })
  const sheets = google.sheets({ version: 'v4', auth })

  // const fileId = await createEmptySheet({ drive, sheets })
  await moveFileToSharedFolder({ drive, fileId: 'abcd' })
  // await drive.files.delete({ fileId: 'defg' })
  await listFiles({ drive })
  // await createFolder({ drive })
  // await shareFile({ drive, fileId: 'ab12' })
}

const listFiles = async ({ drive }) => {
  const listRes = await drive.files.list()
  const files = listRes.data.files
  if (!files.length) {
    console.log('No files')
  } else {
    files.map(async file => {
      console.log(`${file.name} (${file.id})`)
    })
  }
}

const createFolder = async ({ drive }) => {
  const res = await drive.files.create({
    resource: {
      name: 'Dashboard Reports',
      mimeType: 'application/vnd.google-apps.folder'
    }
  })
  console.log(res)
}

const createEmptySheet = async ({ sheets }) => {
  const request = {
    resource: {
      properties: {
        title: 'Test Spreadsheet'
      }
    }
  }
  const res = await sheets.spreadsheets.create(request)
  console.log(res.data)
  return res.data.spreadsheetId
}

const shareFile = async ({ drive, fileId }) => {
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

const moveFileToSharedFolder = async ({ drive, fileId }) => {
  await drive.files.update({
    fileId,
    addParents: [FOLDER_ID]
  })
}

main().catch(console.error)
