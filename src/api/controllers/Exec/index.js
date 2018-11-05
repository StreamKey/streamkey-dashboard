import fetchData from './fetchData'
import createReport from './createReport'

export default async (script, body) => {
  try {
    let res
    switch (script) {
      case 'fetchData':
        res = await fetchData(body)
        break
      case 'createReport':
        res = await createReport(body)
        break
      default:
        throw new Error('unknown-exec-script')
    }
    return res
  } catch (e) {
    throw e
  }
}
