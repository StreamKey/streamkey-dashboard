import Logs from '../controllers/Logs/'

export default async req => {
  const data = await Logs.get(req.params.file)
  return {
    success: true,
    data
  }
}
