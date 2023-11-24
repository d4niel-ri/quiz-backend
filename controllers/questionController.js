const Joi = require("joi");
const { Op } = require("sequelize");

const { Quiz, Question, User, sequelize } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.getQuestions = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    
    const foundQuiz = await Quiz.findByPk(quiz_id, {
      include: [{model: Question}]
    });

    if (!foundQuiz)
      return handleClientError(res, 404, "Quiz Not Found");

    const questions = foundQuiz.Questions;
    return res.status(200).json({ data: questions, status: "Success" });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getQuestion = async (req, res) => {
  try {
    const {question_id} = req.query;
    if (!question_id)
      return handleClientError(res, 404, "Need query `question_id`");

    const foundQuestion = await Question.findByPk(question_id);

    if (!foundQuestion)
      return handleClientError(res, 404, "Question Not Found");

    return res.status(200).json({ data: foundQuestion, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.createQuestion = async (req, res) => {
  try {
    const {quiz_id} = req.params;

    const newData = req.body;
    const scheme = Joi.object({
      question_no: Joi.number(),
      question_text: Joi.string(),
      answers: Joi.array().items(
        Joi.object({
          choice: Joi.string().length(1).required(),
          text: Joi.string().required(),
          isCorrect: Joi.boolean().required(),
        })
      ).unique((a, b) => a.choice === b.choice)
    });

    const { error } = scheme.validate(newData);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundQuiz = await Quiz.findByPk(quiz_id);
    if (!foundQuiz) return handleClientError(res, 404, 'Quiz Not Found');

    if (req.user.role !== 1 && req.user.id !== foundQuiz.author_id)
      return handleClientError(res, 400, "Not Authorized");

    const existQuestion = await Question.findOne({
      where: {quiz_id: quiz_id, question_no: newData.question_no}
    });
    if (existQuestion) return handleClientError(res, 400, "This quiz_id already had this question_no");
    
    newData.answers = JSON.stringify(newData.answers);
    const createdQuestion = await Question.create({...newData, quiz_id: quiz_id});
    res.status(201).json({ data: createdQuestion, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.updateQuestion = async (req, res) => {
  try {
    const {question_id} = req.params;

    const dataReq = req.body;
    const scheme = Joi.object({
      question_text: Joi.string().optional(),
      answers: Joi.array().items(
        Joi.object({
          choice: Joi.string().length(1).required(),
          text: Joi.string().required(),
          isCorrect: Joi.boolean().required(),
        })
      ).unique((a, b) => a.choice === b.choice).optional()
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundQuestion = await Question.findByPk(question_id, {include: Quiz});
    if (req.user.role !== 1 && foundQuestion.Quiz.author_id !== req.user.id)
      return handleClientError(res, 400, "Not Authorized");

    if (dataReq.question_text) foundQuestion.question_text = dataReq.question_text;
    if (dataReq.answers) {
      dataReq.answers = JSON.stringify(dataReq.answers);
      console.log(dataReq.answers, "<< ANSWERS");
      foundQuestion.answers = dataReq.answers;  
    } 
    await foundQuestion.save();

    const reloadQuestion = await Question.findByPk(question_id);
    
    res.status(200).json({ data: reloadQuestion, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.deleteQuestion = async (req, res) => {
  try {
    const {question_id} = req.params;

    const foundQuestion = await Question.findByPk(question_id, {include: Quiz});
    if (!foundQuestion) return handleClientError(res, 404, "Question Not Found");

    if (req.user.role !== 1 && foundQuestion.Quiz.author_id !== req.user.id)
      return handleClientError(res, 400, "Not Authorized");

    await sequelize.transaction(async(t) => {
      // Step 1: Delete the target question
      await Question.destroy({where: {id: question_id}, transaction: t});

      // Step 2: Find questions with question_no greater than the deleted question's question_no
      const questionsToUpdate = await Question.findAll({
        where: {
          quiz_id: foundQuestion.quiz_id,
          question_no: { [Op.gt]: foundQuestion.question_no },
        },
        transaction: t
      });

      for (const questionToUpdate of questionsToUpdate) {
        questionToUpdate.question_no -= 1;
        await questionToUpdate.save({transaction: t});
      }

      const foundQuiz = await Quiz.findByPk(foundQuestion.quiz_id, {
        include: [{model: Question}],
        transaction: t
      });

      const questions = foundQuiz.Questions;
      return res.status(200).json({ data: questions, status: "Success" });
    })

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}