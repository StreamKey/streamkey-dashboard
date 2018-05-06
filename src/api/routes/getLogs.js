import Logs from '../controllers/Log/'

export default async req => {
  const logs = await Logs.list()
  return {
    success: true,
    logs
  }
}
