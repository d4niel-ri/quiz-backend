'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('CompletedQuizzes', [
      {
        user_id: 4,
        quiz_id: 1,
        score: 80,
        completion_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 4,
        quiz_id: 1,
        score: 85,
        completion_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        quiz_id: 1,
        score: 75,
        completion_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        quiz_id: 3,
        score: 90,
        completion_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        quiz_id: 2,
        score: 92,
        completion_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        quiz_id: 3,
        score: 88,
        completion_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        quiz_id: 3,
        score: 100,
        completion_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more completed quiz data as needed
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CompletedQuizzes', null, {})
  }
};
