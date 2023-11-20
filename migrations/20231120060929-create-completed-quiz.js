'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CompletedQuizzes', {
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'CASCADE', // TODO: Debug this
        }
      },
      quiz_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Quizzes',
          key: 'id',
          onDelete: 'CASCADE', // TODO: Debug this
        }
      },
      completion_no: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      score: {
        type: Sequelize.FLOAT
      },
      completion_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('CompletedQuizzes');
  }
};