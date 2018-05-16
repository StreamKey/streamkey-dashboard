import uploadTagGenerator from '../controllers/LegacyFtp/uploadTagGenerator'

export default async req => {
  try {
    const res = await uploadTagGenerator(req.files.fileToUpload)
    return {
      success: res === true
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
