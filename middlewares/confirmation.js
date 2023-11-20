const Joi = require("joi");

const { User } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");
const { checkPassword } = require("../utils/handlePassword");

exports.confirmation = async(req, res, next) => {
  try {
    const dataReq = req.body;
    const scheme = Joi.object({
      confirmationPassword: Joi.string().required()
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundUser = await User.findByPk(req.user.id);
    if (!checkPassword(dataReq.confirmationPassword, foundUser.password))
      return handleClientError(res, 400, "Invalid confirmation password");

    next();

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}