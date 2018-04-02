import uuid from 'uuid/v4'
import Pool from 'pg-pool'
import session from 'express-session'
import ConnectPG from 'connect-pg-simple'

// Using a custom DB pool, as Sequelize doesn't expose its pool
const pool = new Pool({
  host:     process.env.RAZZLE_PG_HOST,
  port:     process.env.RAZZLE_PG_PORT,
  user:     process.env.RAZZLE_PG_USER,
  password: process.env.RAZZLE_PG_PASSWORD,
  database: process.env.RAZZLE_PG_DB,
  max: 10,
  idleTimeoutMillis: 30000,
  Promise
})

pool.on('error',  (err, client) => {
  console.error('idle client error', err.message, err.stack)
})

const {
  RAZZLE_SESSION_TABLE = 'session',
  RAZZLE_COOKIE_SECRET = 'defaultsecret',
  RAZZLE_SESSION_KEY = 'session',
  RAZZLE_COOKIE_DAYS_TOEXPIRE = 90
} = process.env

const pgSession = ConnectPG(session)
const store = pool ? new pgSession({
  pool,
  tableName: RAZZLE_SESSION_TABLE
}) : new session.MemoryStore()

const sessionConfig = {
  store,
  name: RAZZLE_SESSION_KEY,
  secret: RAZZLE_COOKIE_SECRET,
  cookie: { maxAge: Number(RAZZLE_COOKIE_DAYS_TOEXPIRE) * 24 * 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: true,
  genid: req => uuid()
}

export default app => {
  app.use(session(sessionConfig))
}
