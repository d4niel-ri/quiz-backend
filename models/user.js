'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../utils/handlePassword');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Quiz, {
        foreignKey: {
          name: 'author_id'
        }
      });
      User.hasMany(models.CompletedQuiz, {
        foreignKey: {
          name: 'user_id'
        }
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', hashPassword(value));
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false
    },
    reset_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};