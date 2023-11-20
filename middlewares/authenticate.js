const { User } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");
const { validateToken } = require("../utils/handleToken");

exports.authenticate = async(req, res, next) => {
  try {
    if (!req.headers.authorization) return handleClientError(res, 400, "Need to login");

    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(" ")[1];
    const decoded = validateToken(token);
    if (!decoded) {
      return handleClientError(res, 400, "Token is invalid");
    }

    const { id, role } = decoded;
    const foundUser = await User.findByPk(id);
    if (!foundUser) {
      return handleClientError(res, 400, "Token is invalid");
    }

    req.user = {id, role};
    next();

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}