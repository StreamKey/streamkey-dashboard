import express from 'express'
import bodyParser from 'body-parser'

import DB from '../DB/'
import mountSession from './Session'
import mountRoutes from './routes/'

const app = express()
const initDB = async () => {
  await DB.init()
  console.log('🗄 DB is ready')
}

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mountSession(app)
app.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
mountRoutes(app)
initDB()

export default app
