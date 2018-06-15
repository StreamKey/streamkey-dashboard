import runLkqdTremorDuplicate from '../controllers/LegacyFtp/runLkqdTremorDuplicate'

export default async req => {
  try {
    const action = req.params.action
    const res = await runLkqdTremorDuplicate(action)
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
