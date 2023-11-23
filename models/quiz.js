'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Quiz.belongsTo(models.User, {
        foreignKey: {
          name: "author_id"
        },
      });
      Quiz.hasMany(models.Question, {
        foreignKey: {
          name: "quiz_id"
        },
        onDelete: 'CASCADE',
      });
      Quiz.hasMany(models.CompletedQuiz, {
        foreignKey: {
          name: 'quiz_id'
        },
        onDelete: 'CASCADE',
      })
    }
  }
  Quiz.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false 
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};