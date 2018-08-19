import Sequelize from 'sequelize'

export default sequelize => {
  const SspData = sequelize.define('SspData', {
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tag: {
      type: Sequelize.STRING,
      allowNull: false
    },
    opp: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    imp: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    rev: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    sCost: {
      type: Sequelize.DECIMAL,
      allowNull: false
    }
  }, {
    timestamps: false,
    indexes: [
      {
        fields: ['date', 'key']
      }
    ]
  })
  SspData.removeAttribute('id')
  return SspData
}
