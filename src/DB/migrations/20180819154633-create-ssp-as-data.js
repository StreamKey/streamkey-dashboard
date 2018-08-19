'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SspData', {
      date: {
        type: Sequelize.DATE
      },
      key: {
        type: Sequelize.STRING
      },
      tag: {
        type: Sequelize.STRING
      },
      opp: {
        type: Sequelize.INTEGER
      },
      imp: {
        type: Sequelize.INTEGER
      },
      rev: {
        type: Sequelize.DECIMAL
      },
      sCost: {
        type: Sequelize.DECIMAL
      }
    })

    await queryInterface.createTable('AsData', {
      date: {
        type: Sequelize.DATE
      },
      key: {
        type: Sequelize.STRING
      },
      tag: {
        type: Sequelize.STRING
      },
      opp: {
        type: Sequelize.INTEGER
      },
      imp: {
        type: Sequelize.INTEGER
      },
      rev: {
        type: Sequelize.DECIMAL
      },
      cost: {
        type: Sequelize.DECIMAL
      },
      sCost: {
        type: Sequelize.DECIMAL
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SspData')
    await queryInterface.dropTable('AsData')
  }
}
