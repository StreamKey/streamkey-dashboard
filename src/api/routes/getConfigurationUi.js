import configuration from '../controllers/LegacyFtp/configuration'

export default async req => {
  try {
    const jsonData = await configuration.load(req.params.as)
    return {
      jsonData
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
