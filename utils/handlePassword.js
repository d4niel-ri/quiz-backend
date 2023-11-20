require("dotenv").config();
const bcrypt = require('bcryptjs');

const SALT = process.env.SALT;

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, SALT);
}

exports.checkPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
}