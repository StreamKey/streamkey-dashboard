'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reports', 'asPcpm', {
      type: Sequelize.DECIMAL
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reports', 'asPcpm')
  }
}
