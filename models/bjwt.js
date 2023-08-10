const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class bjwt extends Model {}

bjwt.init(
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
    modelName: 'bjwt',
  }
);

module.exports = bjwt;