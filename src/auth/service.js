const db = require('../models');
const AppError = require('../common/app-error');
const { hashPassword } = require('./helpers/password-helper');

const register = async (credentials) => {
  const { email, fullName, password } = credentials;
  const isFound = await db.User.findOne({
    where: { email }
  });
  if (isFound) {
    throw new AppError(400, "Email already exists. Please login with your credentials");
  }
  const hashedPassword = await hashPassword(password);
  
  const user = await db.User.create({
    full_name: fullName,
    email,
    password: hashedPassword
  });

  if (!user) {
    throw new AppError(500, "Something went wrong. Could not create user at this time. Please try again later");
  }
  return user;
};

module.exports = {
  register,
};