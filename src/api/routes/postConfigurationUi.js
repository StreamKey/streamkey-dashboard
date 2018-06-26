import configuration from '../controllers/LegacyFtp/configuration'

export default async req => {
  try {
    await configuration.save(req.params.as, req.body)
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
