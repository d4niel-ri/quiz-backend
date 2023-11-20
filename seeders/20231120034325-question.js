'use strict';

const { Quiz } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Fetch quiz data to get quiz_ids
    const quizzes = await Quiz.findAll();

    // Map quiz titles to corresponding quiz_ids
    const quizIdMap = {};
    quizzes.forEach((quiz) => {
      quizIdMap[quiz.title] = quiz.id;
    });

    // Seed questions for each quiz
    await queryInterface.bulkInsert('Questions', [
      // Questions for Math Quiz
      {
        quiz_id: quizIdMap['Math Quiz'],
        question_no: 1,
        question_text: 'What is 2 + 2?',
        answers: JSON.stringify([
          { choice: 'A', text: '3', isCorrect: false },
          { choice: 'B', text: '4', isCorrect: true },
          { choice: 'C', text: '5', isCorrect: false },
          { choice: 'D', text: '6', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quiz_id: quizIdMap['Math Quiz'],
        question_no: 2,
        question_text: 'Solve for x: 3x - 5 = 10',
        answers: JSON.stringify([
          { choice: 'A', text: '3', isCorrect: false },
          { choice: 'B', text: '5', isCorrect: true },
          { choice: 'C', text: '7', isCorrect: false },
          { choice: 'D', text: '10', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quiz_id: quizIdMap['Math Quiz'],
        question_no: 3,
        question_text: 'If a square has sides of length 5, what is its area?',
        answers: JSON.stringify([
          { choice: 'A', text: '20', isCorrect: false },
          { choice: 'B', text: '25', isCorrect: true },
          { choice: 'C', text: '30', isCorrect: false },
          { choice: 'D', text: '35', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Questions for Science Quiz
      {
        quiz_id: quizIdMap['Science Quiz'],
        question_no: 1,
        question_text: 'What is the chemical symbol for water?',
        answers: JSON.stringify([
          { choice: 'A', text: 'H2O', isCorrect: true },
          { choice: 'B', text: 'CO2', isCorrect: false },
          { choice: 'C', text: 'O2', isCorrect: false },
          { choice: 'D', text: 'N2', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quiz_id: quizIdMap['Science Quiz'],
        question_no: 2,
        question_text: 'Who developed the theory of relativity?',
        answers: JSON.stringify([
          { choice: 'A', text: 'Isaac Newton', isCorrect: false },
          { choice: 'B', text: 'Galileo Galilei', isCorrect: false },
          { choice: 'C', text: 'Albert Einstein', isCorrect: true },
          { choice: 'D', text: 'Niels Bohr', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quiz_id: quizIdMap['Science Quiz'],
        question_no: 3,
        question_text: 'What is the powerhouse of the cell?',
        answers: JSON.stringify([
          { choice: 'A', text: 'Mitochondria', isCorrect: true },
          { choice: 'B', text: 'Nucleus', isCorrect: false },
          { choice: 'C', text: 'Endoplasmic Reticulum', isCorrect: false },
          { choice: 'D', text: 'Ribosome', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Questions for History Quiz
      {
        quiz_id: quizIdMap['History Quiz'],
        question_no: 1,
        question_text: 'In which year did World War II end?',
        answers: JSON.stringify([
          { choice: 'A', text: '1943', isCorrect: false },
          { choice: 'B', text: '1945', isCorrect: true },
          { choice: 'C', text: '1950', isCorrect: false },
          { choice: 'D', text: '1939', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quiz_id: quizIdMap['History Quiz'],
        question_no: 2,
        question_text: 'Who was the first president of the United States?',
        answers: JSON.stringify([
          { choice: 'A', text: 'Thomas Jefferson', isCorrect: false },
          { choice: 'B', text: 'George Washington', isCorrect: true },
          { choice: 'C', text: 'John Adams', isCorrect: false },
          { choice: 'D', text: 'Abraham Lincoln', isCorrect: false },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quiz_id: quizIdMap['History Quiz'],
        question_no: 3,
        question_text: 'What was the Renaissance?',
        answers: JSON.stringify([
          { choice: 'A', text: 'A musical genre', isCorrect: false },
          { choice: 'B', text: 'A historical period of cultural rebirth', isCorrect: true },
          { choice: 'C', text: 'A type of painting', isCorrect: false },
          { choice: 'D', text: 'A scientific theory', isCorrect: false },
          // Add more answers as needed
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Add questions for other quizzes here...
    ]);

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Questions', null, {})
  }
};
