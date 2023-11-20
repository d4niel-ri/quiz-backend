const express = require('express');

const userRoute = require('./userRoute');
const quizRoute = require('./quizRoute');

const router = express.Router();

router.use("/user", userRoute);
router.use("/quiz", quizRoute);

module.exports = router;