import Sequelize from 'sequelize'

export default sequelize => {
  var Report = sequelize.define('Report', {
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
    as: Sequelize.STRING,
    asOpp: Sequelize.INTEGER,
    asImp: Sequelize.INTEGER,
    asRev: Sequelize.DECIMAL,
    profit: Sequelize.DECIMAL,
    margin: Sequelize.DECIMAL
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
