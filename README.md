# StreamKey Admin Dashboard

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
* `git clone git@github.com:StreamKey/streamkey-dashboard.git`
* `yarn`
* create `.env`:
```
NODE_ENV=development
PORT=3011
RAZZLE_ROOT_URL=http://localhost:3011

RAZZLE_PG_HOST=127.0.0.1
RAZZLE_PG_PORT=5445
RAZZLE_PG_DB=postgres
RAZZLE_PG_USER=postgres
RAZZLE_PG_PASSWORD=mysecretpassword

RAZZLE_SESSION_TABLE=session
RAZZLE_COOKIE_SECRET=
RAZZLE_SESSION_KEY=session
RAZZLE_COOKIE_DAYS_TOEXPIRE=90

RAZZLE_CREDENTIALS_STREAMRAIL_USERNAME=
RAZZLE_CREDENTIALS_STREAMRAIL_PASSWORD=

RAZZLE_CREDENTIALS_LKQD_USERNAME=
RAZZLE_CREDENTIALS_LKQD_PASSWORD=

RAZZLE_CREDENTIALS_ANIVIEW_USERNAME=
RAZZLE_CREDENTIALS_ANIVIEW_PASSWORD=
RAZZLE_CREDENTIALS_ANIVIEW_REPORTID=

RAZZLE_CREDENTIALS_TELARIA_USERNAME=
RAZZLE_CREDENTIALS_TELARIA_PASSWORD=
RAZZLE_CREDENTIALS_TELARIA_TIMEOUT=60

RAZZLE_CREDENTIALS_FREEWHEEL_USERNAME=
RAZZLE_CREDENTIALS_FREEWHEEL_PASSWORD=

RAZZLE_CREDENTIALS_AERSERV_USERNAME=
RAZZLE_CREDENTIALS_AERSERV_KEY=

RAZZLE_CREDENTIALS_BEACHFRONT_USERNAME=
RAZZLE_CREDENTIALS_BEACHFRONT_PASSWORD=

RAZZLE_CREDENTIALS_ONEVIDEO_USERNAME=
RAZZLE_CREDENTIALS_ONEVIDEO_PASSWORD=
RAZZLE_CREDENTIALS_ONEVIDEO_CLIENTID=661ed1e0-3e06-4fd6-ba14-2f3925a3ddeb

RAZZLE_DB_LOGGING=true
```

## DB
We use the [Sequelize](http://docs.sequelizejs.com/) ORM over Postgresql.

To run a local DB in a docker container, make sure you're logged in to docker with `docker login` and then run `yarn db:start`. It will launch a pg instance on local port 5444 with the user postgres/mysecretpassword.

To remove the container run `yarn db:rm`.

Connect to the DB:
```
docker run -it --rm --link streamkey-postgres:postgres postgres psql -h postgres -U postgres
```

Sync DB with:
```
yarn sequelize db:migrate --config src/DB/config.js
```
Add a DB model and a [migration](http://docs.sequelizejs.com/manual/tutorial/migrations.html):
```
yarn sequelize model:generate --name User --attributes firstName:string,lastName:string
```
Then edit the `src/DB/migrations/xxx-create.user.js` and `src/DB/models/user.js` files.

Add a DB migration to an existing model:
```
yarn sequelize migration:generate --name User
```
Then edit the new migration in `src/DB/migrations` and provide up/down methods using the [QueryInterface API](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html).

## Development
* `yarn start`

## Tests
`yarn test`

## Deployment
