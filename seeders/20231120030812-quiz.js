'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Quizzes', [
      {
        title: 'Math Quiz',
        description: 'Test your math skills!',
        author_id: 3, // Replace with the actual author_id from your User table
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Science Quiz',
        description: 'Explore your knowledge in science',
        author_id: 4, // Replace with the actual author_id from your User table
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'History Quiz',
        description: 'Learn about historical events',
        author_id: 3, // Replace with the actual author_id from your User table
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Programming Quiz',
        description: 'Test your coding skills',
        author_id: 1, // Replace with the actual author_id from your User table
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Geography Quiz',
        description: 'Explore world geography',
        author_id: 2, // Replace with the actual author_id from your User table
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Quizzes', null, {})
  }
};
