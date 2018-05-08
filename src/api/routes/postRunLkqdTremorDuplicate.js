import runLkqdTremorDuplicate from '../controllers/LegacyFtp/runLkqdTremorDuplicate'

export default async () => {
  try {
    const res = await runLkqdTremorDuplicate()
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
