'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reports', 'asRev', {
      type: Sequelize.DECIMAL
    })
    await queryInterface.addColumn('Reports', 'asScost', {
      type: Sequelize.DECIMAL
    })
    await queryInterface.addColumn('Reports', 'sspScost', {
      type: Sequelize.DECIMAL
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reports', 'asRev')
    await queryInterface.removeColumn('Reports', 'asScost')
    await queryInterface.removeColumn('Reports', 'sspScost')
  }
}
