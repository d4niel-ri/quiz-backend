'use strict';

const { hashPassword } = require('../utils/handlePassword');

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
    return queryInterface.bulkInsert('Users', [
      {
        username: "johndoe",
        password: hashPassword("123456"),
        email: "johndoe@gmail.com",
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "jeandoe",
        password: hashPassword("123456"),
        email: "jeandoe@gmail.com",
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "agus",
        password: hashPassword("123456"),
        email: "agus@gmail.com",
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "asep",
        password: hashPassword("123456"),
        email: "asep@gmail.com",
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "slamet",
        password: hashPassword("123456"),
        email: "slamet@gmail.com",
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {})
  }
};
