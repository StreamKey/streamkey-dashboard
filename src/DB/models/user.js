import Sequelize from 'sequelize'

export default sequelize => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  })
  return User
}
