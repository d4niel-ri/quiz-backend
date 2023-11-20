const Joi = require("joi");
const { Op } = require("sequelize");

const { Quiz, User } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.getQuiz = async(req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      let foundQuiz;
      if (req.user.role === 1) {
        foundQuiz = await Quiz.findByPk(id, {include: [
          { model: User, attributes: ["id", "username", "email"] }
        ]});

      } else {
        foundQuiz = await Quiz.findOne({
          where: {
            id,
            [Op.or] : { author_id: req.user.id, is_published: true }
          },
          include: [{ model: User, attributes: ["id", "username", "email"] }]
        });
      }

      if (!foundQuiz) return handleClientError(res, 404, "Quiz Not Found");
      return res.status(200).json({ data: foundQuiz, status: 'Success' });
      
    } else {
      let response;
      if (req.user.role === 1) {
        response = await Quiz.findAll({include: [
          { model: User, attributes: ["id", "username", "email"] },
        ]});
      
      } else {
        response = await Quiz.findAll({
          where: {
            [Op.or] : { author_id: req.user.id, is_published: true }
          },
          include: [{ model: User, attributes: ["id", "username", "email"] }]
        })
      }
  
      return res.status(200).json({ data: response, status: 'Success' });
    }
  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getMyCreatedQuizzes = async(req, res) => {
  try {
    const response = await Quiz.findAll({
      where: { author_id: req.user.id },
      include: [{ model: User, attributes: ["id", "username", "email"] }]
    });
    
    return res.status(200).json({ data: response, status: 'Success' });

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