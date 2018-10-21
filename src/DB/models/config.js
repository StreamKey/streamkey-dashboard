import Sequelize from 'sequelize'

export default sequelize => {
  const Config = sequelize.define('Config', {
    value: Sequelize.STRING
  })
  return Config
}
