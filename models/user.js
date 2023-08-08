const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      is: /\$[a-z0-9-]+\$[0-9A-Za-z./+=,$-]+$/i,
    },
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'user',
  defaultScope: {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  },
})

module.exports = User