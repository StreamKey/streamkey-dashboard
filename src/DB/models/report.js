import Sequelize from 'sequelize'

export default sequelize => {
  // All costs are in USD
  const Report = sequelize.define('Report', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    tag: Sequelize.STRING,
    ssp: Sequelize.STRING,
    sspOpp: Sequelize.INTEGER,
    sspImp: Sequelize.INTEGER,
    sspCpm: Sequelize.DECIMAL,
    sspRev: Sequelize.DECIMAL,
    sspScost: Sequelize.DECIMAL,
    as: Sequelize.STRING,
    asOpp: Sequelize.INTEGER,
    asImp: Sequelize.INTEGER,
    asCost: Sequelize.DECIMAL,
    asScost: Sequelize.DECIMAL,
    asRev: Sequelize.DECIMAL,
    asCpm: Sequelize.DECIMAL,
    asPcpm: Sequelize.DECIMAL,
    profit: {
      // sspRev - asCost
      type: Sequelize.DECIMAL
    },
    margin: {
      // Percentage of profit/sspRev
      type: Sequelize.DECIMAL
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['date', 'ssp', 'as', 'tag']
      }
    ]
  })

  return Report
}
