'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Reports', 'asRev', {
      type: Sequelize.DECIMAL
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Reports', 'asRev')
  }
}
