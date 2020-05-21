import Sequelize from 'sequelize'

export default sequelize => {
  const CedatoCosts = sequelize.define('CedatoCosts', {
    date: Sequelize.DATE,
    partner: Sequelize.STRING,
    cost: Sequelize.DECIMAL
  }, {
    indexes: [
      {
        fields: ['date']
      }
    ]
  })
  CedatoCosts.removeAttribute('id')
  return CedatoCosts
}
