import exec from '../controllers/Exec/'

export default async req => {
  try {
    await exec(req.params.script, req.body)
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
