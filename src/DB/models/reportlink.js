import Sequelize from 'sequelize'

export default sequelize => {
  const ReportLink = sequelize.define('ReportLink', {
    date: Sequelize.DATE,
    url: Sequelize.STRING
  })
  return ReportLink
}
