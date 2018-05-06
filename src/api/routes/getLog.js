import Log from '../controllers/Log/'

export default async req => {
  const data = await Log.get(req.params.file)
  return {
    success: true,
    data
  }
}
