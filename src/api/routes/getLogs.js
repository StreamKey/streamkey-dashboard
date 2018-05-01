import Logs from '../controllers/Logs/'

export default async req => {
  const logs = await Logs.list()
  return {
    success: true,
    logs
  }
}
