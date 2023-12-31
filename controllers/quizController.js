const Joi = require("joi");
const { Op } = require("sequelize");

const { Quiz, User, Question, CompletedQuiz, sequelize } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.getQuiz = async(req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const foundQuiz = await Quiz.findByPk(id, {include: [
        { model: User, attributes: ["id", "username", "email"] },
        { model: Question, attributes: ['quiz_id'] }
      ]});


      if (!foundQuiz) return handleClientError(res, 404, "Quiz Not Found");
      const quizObject = foundQuiz.toJSON();
      quizObject.questionCount = foundQuiz.Questions.length;
      delete quizObject.Questions;

      return res.status(200).json({ data: quizObject, status: 'Success' });
      
    } else {
      let response;
      if (req.user.role === 1) {
        response = await Quiz.findAll({
          include: [
            { model: User, attributes: ["id", "username", "email"] },
            { model: Question, attributes: ['quiz_id'] }
          ]
        });
      
      } else {
        response = await Quiz.findAll({
          where: { is_published: true },
          include: [
            { model: User, attributes: ["id", "username", "email"] },
            { model: Question, attributes: ['quiz_id'] }
          ]
        })
      }
  
      const quizzesWithQuestionCounts = response.map((quiz) => {
        const quizObject = quiz.toJSON();
        quizObject.questionCount = quizObject.Questions.length; // Include the count
        delete quizObject.Questions; // Exclude the detailed questions
        return quizObject;
      });
      return res.status(200).json({ data: quizzesWithQuestionCounts, status: 'Success' });
    }
  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getMyCompletedQuizzes = async(req, res) => {
  try {
    const completedQuizzes = await CompletedQuiz.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Quiz,
          include: [
            { model: User, attributes: ["id", "username", "email"] },
            { model: Question, attributes: ['quiz_id'] }
          ],
        }
      ],
      order: [['id', 'DESC']],
    });

    // Process the data if needed
    const uniqueQuizIds = new Set();
    const formattedCompletedQuizzes = completedQuizzes
      .filter((completedQuiz) => {
        // Filter out duplicates based on quiz_id
        const quizId = completedQuiz.quiz_id;
        if (!uniqueQuizIds.has(quizId)) {
          uniqueQuizIds.add(quizId);
          return true;
        }
        return false;
      })
      .map((completedQuiz) => {
        const quizData = completedQuiz.Quiz.toJSON();
        quizData.questionCount = quizData.Questions.length;
        delete quizData.Questions;
        
        const completedQuizData = completedQuiz.toJSON();
        quizData.score = completedQuizData.score;
        quizData.completion_date = completedQuizData.completion_date;

        return quizData;
      });

    return res.status(200).json({ data: formattedCompletedQuizzes, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getMyCreatedQuizzes = async(req, res) => {
  try {
    const createdQuizzes = await Quiz.findAll({
      where: { author_id: req.user.id },
      include: [
        { model: User, attributes: ["id", "username", "email"] },
        { model: Question, attributes: ['quiz_id'] }
      ]
    });

    const formattedCreatedQuizzes = createdQuizzes
      .map((createQuiz) => {
        const quizData = createQuiz.toJSON();
        quizData.questionCount = quizData.Questions.length;
        delete quizData.Questions;
        return quizData;
      })
    
    return res.status(200).json({ data: formattedCreatedQuizzes, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.createQuiz = async(req, res) => {
  try {
    const newData = req.body;
    const scheme = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      is_published: Joi.boolean(),
    })

    const { error } = scheme.validate(newData);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const createdQuiz = await Quiz.create({...newData, author_id: req.user.id});
    res.status(201).json({ data: createdQuiz.toJSON(), status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.updateQuiz = async(req, res) => {
  try {
    const { id } = req.params;

    const dataReq = req.body;
    const scheme = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      is_published: Joi.boolean(),
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundQuiz = await Quiz.findByPk(id);
    if (!foundQuiz) return handleClientError(res, 404, "Quiz Not Found");

    if (req.user.role !== 1 && req.user.id !== foundQuiz.author_id)
      return handleClientError(res, 400, "Not Authorized");

    if (dataReq.title) foundQuiz.title = dataReq.title;
    if (dataReq.description) foundQuiz.description = dataReq.description;
    if (dataReq.is_published) foundQuiz.is_published = dataReq.is_published;

    await foundQuiz.save();
    res.status(200).json({ data: foundQuiz, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.deleteQuiz = async(req, res) => {
  try {
    const { id } = req.params;

    const foundQuiz = await Quiz.findByPk(id);
    if (!foundQuiz) return handleClientError(res, 404, "Quiz Not Found");

    if (req.user.role !== 1 && req.user.id !== foundQuiz.author_id)
      return handleClientError(res, 400, "Not Authorized");

    await Quiz.destroy({ where: {id} });
    res.status(200).json({ message: `Success delete '${foundQuiz.title}'`, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}