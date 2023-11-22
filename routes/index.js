const express = require('express');

const userRoute = require('./userRoute');
const quizRoute = require('./quizRoute');
const questionRoute = require('./questionRoute');

const router = express.Router();

router.use("/user", userRoute);
router.use("/quiz", quizRoute);
router.use("/question", questionRoute);

module.exports = router;