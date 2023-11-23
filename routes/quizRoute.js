const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { getQuiz, createQuiz, updateQuiz, deleteQuiz, getMyCreatedQuizzes, getMyCompletedQuizzes } = require('../controllers/quizController');

const router = express.Router();

router.use(authenticate);
router.get("/", getQuiz);
router.get("/my-completed-quizzes", getMyCompletedQuizzes);
router.get("/my-created-quizzes", getMyCreatedQuizzes);
router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

module.exports = router;