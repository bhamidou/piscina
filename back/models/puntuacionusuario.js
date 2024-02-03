'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PuntuacionUsuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PuntuacionUsuario.init({
    id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
    puntuacion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PuntuacionUsuario',
    tableName: 'puntuacionUsuarios'
  });
  return PuntuacionUsuario;
};