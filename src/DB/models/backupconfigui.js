import Sequelize from 'sequelize'

export default sequelize => {
  const BackupConfigUI = sequelize.define('BackupConfigUI', {
    as: Sequelize.STRING,
    data: Sequelize.JSON
  })
  return BackupConfigUI
}
