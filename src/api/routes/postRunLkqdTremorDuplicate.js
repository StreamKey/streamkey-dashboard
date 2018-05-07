import runLkqdTremorDuplicate from '../controllers/LegacyFtp/runLkqdTremorDuplicate'

export default async () => {
  const res = await runLkqdTremorDuplicate()
  return {
    success: res === true
  }
}
