# StreamKey Dashboard

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
* `git clone git@github.com:StreamKey/streamkey-dashboard.git`
* `yarn`
* create `.env`:
```
NODE_ENV=development
PORT=3011
DEPLOY_USER=ubuntu
DEPLOY_HOST=
DEPLOY_SSH_KEY=
GOOGLE_APPLICATION_CREDENTIALS=
GOOGLE_DRIVE_REPORTS_FOLDER=

RAZZLE_ROOT_URL=http://localhost:3011
RAZZLE_LOGS_PATH=/absolute/path/to/logs
RAZZLE_TMP_PATH=/absolute/path/to/tmp

RAZZLE_LEGACY_USER=
RAZZLE_LEGACY_PASSWORD=
RAZZLE_LEGACY_HOST=
RAZZLE_LEGACY_SSH_KEY=

RAZZLE_EMAIL_HOST=
RAZZLE_EMAIL_USER=
RAZZLE_EMAIL_PASS=
RAZZLE_EMAIL_PORT=
RAZZLE_EMAIL_FROM_NAME=Dashboard Notifications
RAZZLE_EMAIL_FROM_ADDRESS=
RAZZLE_REPORT_SCRIPT_EMAIL_RECEPIENTS=

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

RAZZLE_CREDENTIALS_LKQD_APIKEY=
RAZZLE_CREDENTIALS_LKQD_APISECRET=

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
RAZZLE_CREDENTIALS_BEACHFRONT_REPORT_ID=

RAZZLE_CREDENTIALS_SPOTX_USERNAME=
RAZZLE_CREDENTIALS_SPOTX_PASSWORD=
RAZZLE_CREDENTIALS_SPOTX_PUBLISHERID=152300
RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_ID=
RAZZLE_CREDENTIALS_SPOTX_OAUTH_CLIENT_SECRET=

RAZZLE_CREDENTIALS_ONEVIDEO_CLIENTID=
RAZZLE_CREDENTIALS_ONEVIDEO_SECRET=
RAZZLE_CREDENTIALS_ONEVIDEO_ORGID=19441

RAZZLE_CREDENTIALS_SPRINGSERVE_USERNAME=
RAZZLE_CREDENTIALS_SPRINGSERVE_PASSWORD=

RAZZLE_DB_LOGGING=true
```

## DB
We use the [Sequelize](http://docs.sequelizejs.com/) ORM over Postgresql.

To run a local DB in a docker container, make sure you're logged in to docker with `docker login` and then run `yarn db:install`. It will launch a pg instance on local port 5444 with the user postgres/mysecretpassword.
Run `yarn db:start` if this container exists and is stopped.

To remove the container run `yarn db:rm`.

Connect to the DB:
```
docker run -it --rm --link streamkey-postgres:postgres postgres psql -h postgres -U postgres
```

Sync DB with:
```
yarn sequelize db:migrate --config src/DB/config.js
```
Undo migration:
```
yarn sequelize db:migrate:undo --config src/DB/config.js
```
Add a DB model and a [migration](http://docs.sequelizejs.com/manual/tutorial/migrations.html):
```
yarn sequelize model:generate --name User --attributes firstName:string,lastName:string
```
Then edit the `src/DB/migrations/xxx-create.user.js` and `src/DB/models/user.js` files.

Finally add your model to the DB class and use it like this (table name is prular):
```
await DB.models.Users.create({ ... })
```

Add a DB migration to an existing model:
```
yarn sequelize migration:generate --name User
```
Then edit the new migration in `src/DB/migrations` and provide up/down methods using the [QueryInterface API](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html).

Example of SQL query:
```
docker run -it --rm --link streamkey-postgres:postgres postgres psql -h postgres -U postgres -d postgres -t -A -F"," -c "SELECT * FROM \"SspData\" WHERE date='2018-09-14' AND key='beachfront'"
```

## Development
* `yarn start`

## Tests
`yarn test`

## Deployment
* make sure all works locally (yarn build && NODE_ENV=production node build/server.js)
* `yarn test`
* bump version
* push to `master`
* `yarn shipit production deploy`
* `yarn shipit production install`
* `yarn shipit production restart`

If something goes wrong, revert to previous deployment with:
`yarn shipit production rollback`
