'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quiz_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          // This is a reference to another model
          model: 'Quizzes',
    
          // This is the column name of the referenced model
          key: 'id',
          onDelete: 'CASCADE', // TODO: Debug this
        }
      },
      question_no: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      question_text: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      answers: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Questions');
  }
};