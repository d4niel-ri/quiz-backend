const Joi = require("joi");
const { Op } = require("sequelize");

const { User } = require("../models");
const { checkPassword } = require("../utils/handlePassword");
const { handleServerError, handleClientError } = require("../utils/handleError");
const { signToken, validateToken } = require("../utils/handleToken");
const { transporter } = require("../utils/handleMail");

exports.verifyToken = async (req, res) => {
  try {
    return res.status(200).json({ status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
};

exports.login = async(req, res) => {
  try {
    const dataReq = req.body;
    const scheme = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })
    
    const foundUser = await User.findOne({ where: {email: dataReq.email} });
    if (!foundUser) {
      return handleClientError(res, 400, "Username or password is invalid");
    }

    const hashPassword = foundUser.password;
    if (!checkPassword(dataReq.password, hashPassword))
      return handleClientError(res, 400, "Username or password is invalid");
    
    const token = signToken(foundUser.id, foundUser.role);
    return res.status(200).json({ token, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.register = async(req, res) => {
  try {
    const newData = req.body;
    const scheme = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
    })

    const { error } = scheme.validate(newData);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const existUserWithSameUsername = await User.findOne({ where: {username: newData.username} });
    if (existUserWithSameUsername) return handleClientError(res, 400, "Username already exist");

    const existUserWithSameEmail = await User.findOne({ where: {email: newData.email} });
    if (existUserWithSameEmail) return handleClientError(res, 400, "Email already exist");

    const createdUser = await User.create(newData);
    const {password, ...createdUserWithoutPassword} = createdUser.toJSON();
    res.status(201).json({ data: createdUserWithoutPassword, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const dataReq = req.body;
    const scheme = Joi.object({
      email: Joi.string().email().required()
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundUser = await User.findOne({ where: {email: dataReq.email} });
    if (!foundUser) return handleClientError(res, 404, "User Not Found");

    const resetToken = foundUser.generateResetToken();
    await foundUser.save();

    const resetUrl = `http://localhost:3000/api/user/reset-password`;
    const htmlContent = `
      <p>Use the form below to reset password:</p>
      <form action="${resetUrl}" method="post">
        <input type="hidden" name="resetToken" value="${resetToken}">
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" name="newPassword" required>
        <br/>
        <input type="submit" value="Reset Password">
      </form>
    `;

    const mailOptions = {
      from: process.env.USERNAME_NODEMAILER, // replace with your email
      to: process.env.USERNAME_NODEMAILER,
      subject: `Password Reset - ${foundUser.username}`,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return handleServerError(res);
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(200).json({ message: "Reset password email sent successfully", status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const dataReq = req.body;
    const scheme = Joi.object({
      resetToken: Joi.string().required(),
      newPassword: Joi.string().min(6).required()
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const decoded = validateToken(dataReq.resetToken);
    if (!decoded) return handleClientError(res, 400, "Reset token is invalid or expired");

    const { id } = decoded;
    const foundUser = await User.findOne({ where: {id, resetToken: dataReq.resetToken} });
    if (!foundUser) return handleClientError(res, 400, "Reset token is invalid or expired");

    foundUser.password = dataReq.newPassword;
    foundUser.resetToken = null;
    await foundUser.save();
    res.status(200).json({ message: "Password reset successful", status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getAllUser = async(req, res) => {
  try {
    const response = await User.findAll({attributes: { exclude: ['password', 'resetToken'] }});
    return res.status(200).json({ data: response, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getUser = async(req, res) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findByPk(id, {attributes: ['id', 'username', 'email'] });
    if (!foundUser) return handleClientError(res, 404, "User Not Found");

    return res.status(200).json({ data: foundUser, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.changeProfile = async(req, res) => {
  try {
    const dataReq = req.body;
    const scheme = Joi.object({
      username: Joi.string(),
      email: Joi.string().email(),
    });

    const { error } = scheme.validate(dataReq);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundUser = await User.findByPk(req.user.id, {attributes: ['id', 'username', 'email'] });
    if (dataReq.username) {
      const existUserWithSameUsername = await User.findOne({ where: {username: dataReq.username} });
      if (existUserWithSameUsername) return handleClientError(res, 400, "Username already exist");

      foundUser.username = dataReq.username;
    }

    if (dataReq.email) {
      const existUserWithSameEmail = await User.findOne({ where: {email: dataReq.email} });
    if (existUserWithSameEmail) return handleClientError(res, 400, "Email already exist");

      foundUser.email = dataReq.email;
    }

    await foundUser.save();
    res.status(200).json({ data: foundUser, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.changePassword = async (req, res) => {
  try {
    const newData = req.body;
    const scheme = Joi.object({
      oldPassword: Joi.string().required(),
      password: Joi.string().min(6).required()
    })

    const { error } = scheme.validate(newData);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const foundUser = await User.findByPk(req.user.id);
    if (!checkPassword(newData.oldPassword, foundUser.password)) {
      return handleClientError(res, 400, "Invalid old password");
    }

    foundUser.password = newData.password;

    await foundUser.save();
    await foundUser.reload();
    return res.status(200).json({ message: 'Password succesfully changed', status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.createAdmin = async (req, res) => {
  try {
    const newData = req.body;
    const scheme = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
    })

    const { error } = scheme.validate(newData);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    const existUserWithSameUsername = await User.findOne({ where: {username: newData.username} });
    if (existUserWithSameUsername) return handleClientError(res, 400, "Username already exist");

    const existUserWithSameEmail = await User.findOne({ where: {email: newData.email} });
    if (existUserWithSameEmail) return handleClientError(res, 400, "Email already exist");

    const createdAdmin = await User.create({...newData, role: 'admin'});
    const {password, ...createdAdminWithoutPassword} = createdAdmin.toJSON(); 
    res.status(201).json({ data: createdAdminWithoutPassword, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.deleteUser = async(req, res) => {
  try {
    const { id } = req.params;
    
    const foundUser = await User.findByPk(id);
    if (!foundUser) return handleClientError(res, 404, "User Not Found");

    await User.destroy({where: {id: id}});
    res.status(200).json({ message: `Success delete \`${foundUser.username}\``, status: 'Success'})

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}