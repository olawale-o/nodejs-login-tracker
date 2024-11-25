const moment = require("moment");
const db = require("../models");
const AppError = require("../common/app-error");
const { hashPassword, comparePassword } = require("./helpers/password-helper");

const register = async (credentials) => {
  const { email, fullName, password } = credentials;
  const isFound = await db.User.findOne({
    where: { email },
  });
  if (isFound) {
    throw new AppError(
      400,
      "Email already exists. Please login with your credentials",
    );
  }
  const hashedPassword = await hashPassword(password);

  const user = await db.User.create({
    full_name: fullName,
    email,
    password: hashedPassword,
  });

  if (!user) {
    throw new AppError(
      500,
      "Something went wrong. Could not create user at this time. Please try again later",
    );
  }
  return user;
};

const login = async (credentials) => {
  const { email, password } = credentials;
  const isFound = await db.User.findOne({
    where: { email },
  });
  if (!isFound) {
    throw new AppError(400, "Invalid email or password");
  }

  if (isFound.next_unlock_time && moment().isBefore(isFound.next_unlock_time)) {
    throw new AppError(400, "Your account is still locked");
  }

  const isPasswordValid = await comparePassword(password, isFound.password);

  if (!isPasswordValid) {
    if (isFound.login_attempts >= 3) {
      await db.User.update(
        {
          is_locked: true,
          next_unlock_time: moment().add(1, "minutes").valueOf(),
        },
        { where: { email } },
      );
      throw new AppError(400, "You cannot login at this time");
    }
    isFound.login_attempts += 1;
    await db.User.update(
      {
        login_attempts: isFound.login_attempts,
      },
      { where: { email } },
    );
    throw new AppError(
      400,
      "Your password is invalid, you have few attempts to try",
    );
  }

  await db.User.update(
    {
      login_attempts: 0,
      is_locked: false,
      next_unlock_time: null,
    },
    { where: { email } },
  );
};

module.exports = {
  register,
  login,
};
