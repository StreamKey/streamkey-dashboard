# StreamKey Dashboard

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
* `git clone git@github.com:StreamKey/streamkey-dashboard.git`
* `yarn`
* create `.env`, use `env.template` as a reference

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

### Add new partner
1. Create new fetch file at `src/workers/scrapeDaily/[AS|SSP]/`
2. Store credentials in `.env` and add variable names to `README.md`
3. Add partner to `src/workers/scrapeDaily/[GetASData|GetSSPData]`
4. Add partner key to `src/workers/scrapeDaily/fetchData`
5. Add partner key to `src/workers/scrapeDaily/createReport`
6. Add partner to `src/components/Utils`
7. Add partner key to `src/api/controllers/Report/groupBySspAs`
8. Update `defaultPageSize` with number of SSPs in `DiscrepancyReport` and `SspAsReport`
9. Update server crontab

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
