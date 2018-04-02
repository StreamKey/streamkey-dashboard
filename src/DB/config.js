require('../../env.js')

const {
  RAZZLE_PG_HOST,
  RAZZLE_PG_PORT,
  RAZZLE_PG_DB,
  RAZZLE_PG_USER,
  RAZZLE_PG_PASSWORD
} = process.env

module.exports = {
  development: {
    username: RAZZLE_PG_USER,
    password: RAZZLE_PG_PASSWORD,
    database: RAZZLE_PG_DB,
    host: RAZZLE_PG_HOST,
    port: RAZZLE_PG_PORT,
    dialect: 'postgres'
  }
}
