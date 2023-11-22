const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { getQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');

const router = express.Router();

router.use(authenticate);
router.get("/:quiz_id", getQuestions);

router.post("/:quiz_id", createQuestion);
router.put("/:question_id", updateQuestion);
router.delete("/:question_id", deleteQuestion);

module.exports = router;