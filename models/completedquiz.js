'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompletedQuiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CompletedQuiz.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id'
        },
        onDelete: 'CASCADE'
      });
      CompletedQuiz.belongsTo(models.Quiz, {
        foreignKey: {
          name: 'quiz_id'
        },
        onDelete: 'CASCADE'
      })
    }
  }
  CompletedQuiz.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completion_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: DataTypes.FLOAT,
    completion_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CompletedQuiz',
  });
  return CompletedQuiz;
};