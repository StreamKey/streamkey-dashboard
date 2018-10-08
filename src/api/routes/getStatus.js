const packageJson = require('../../../package.json')

export default async req => {
  return {
    success: true,
    version: packageJson.version
  }
}
