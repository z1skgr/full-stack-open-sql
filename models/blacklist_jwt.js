const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class BlacklistJwt extends Model {}

BlacklistJwt.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blacklistJwt',
  }
);

module.exports = BlacklistJwt;