import '../../env'
import { init, listFiles, deleteFile, createFolder } from '../api/controllers/Google/Sheets'

const main = async () => {
  await init()
  const files = await listFiles({ query: '' })
  console.log(files)

  // await deleteFile({ fileId: 'ab12' })
  // await createFolder()
  // await shareFile({ fileId: 'ab12' })
}

main()
