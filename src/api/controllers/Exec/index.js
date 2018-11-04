
export default async (script, jsonData) => {
  switch (script) {
    case 'fetchData':
      return {
        script,
        jsonData
      }
    case 'createReport':
      return {
        script,
        jsonData
      }
    default:
      throw new Error('unknown-exec-script')
  }
}
