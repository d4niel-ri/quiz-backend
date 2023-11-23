'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Quiz, {
        foreignKey: {
          name: 'quiz_id'
        },
      });
    }
  }
  Question.init({
    quiz_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    question_no: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    question_text: {
      allowNull: false,
      type: DataTypes.TEXT 
    },
    answers: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};