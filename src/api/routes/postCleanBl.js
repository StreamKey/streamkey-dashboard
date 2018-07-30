import cleanBl from '../controllers/LegacyFtp/cleanBl'

export default async req => {
  try {
    const action = req.params.action
    const res = await cleanBl(action)
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
