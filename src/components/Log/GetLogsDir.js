import path from 'path'

export default () => {
  const LOGS_DIR = process.env.RAZZLE_LOGS_PATH || path.join(__dirname, '..', '..', '..', 'logs')
  return LOGS_DIR
}
