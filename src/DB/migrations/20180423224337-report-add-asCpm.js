'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Reports', 'asCpm', {
      type: Sequelize.DECIMAL
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Reports', 'asCpm')
  }
}
