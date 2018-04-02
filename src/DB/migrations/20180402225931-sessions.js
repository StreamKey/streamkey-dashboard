'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Will run this query: https://github.com/voxpelli/node-connect-pg-simple/blob/master/table.sql
   return queryInterface.sequelize.query(`
    CREATE TABLE "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
   `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('session')
  }
};
