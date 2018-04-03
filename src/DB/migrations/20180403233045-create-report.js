'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      tag: {
        type: Sequelize.STRING
      },
      ssp: {
        type: Sequelize.STRING
      },
      sspOpp: {
        type: Sequelize.INTEGER
      },
      sspImp: {
        type: Sequelize.INTEGER
      },
      sspCpm: {
        type: Sequelize.DECIMAL
      },
      sspRev: {
        type: Sequelize.DECIMAL
      },
      as: {
        type: Sequelize.STRING
      },
      asOpp: {
        type: Sequelize.INTEGER
      },
      asImp: {
        type: Sequelize.INTEGER
      },
      asRev: {
        type: Sequelize.DECIMAL
      },
      profit: {
        type: Sequelize.DECIMAL
      },
      margin: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {});
    await queryInterface.addIndex('Reports', {
      unique: true,
      fields: ['date', 'ssp', 'as', 'tag']
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reports');
    await queryInterface.removeIndex('Reports', 'reports_date_ssp_as_tag');
  }
};