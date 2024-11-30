const moment = require("moment");
const db = require("../models");
const AppError = require("../common/app-error");
const { hashPassword, comparePassword } = require("./helpers/password-helper");

const LOCK_TIME = 1;
const MAX_LOGIN_ATTEMPTS = 3;

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
    fullName: fullName,
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

  if (isFound.nextUnlockTime && moment().isBefore(isFound.nextUnlockTime)) {
    throw new AppError(400, "Your account is still locked");
  }

  const isPasswordValid = await comparePassword(password, isFound.password);

  if (!isPasswordValid) {
    if (isFound.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      await db.User.update(
        {
          isLocked: true,
          nextUnlockTime: moment().add(LOCK_TIME, "minutes").valueOf(),
        },
        { where: { email } },
      );
      throw new AppError(400, "You cannot login at this time");
    }
    isFound.loginAttempts += 1;
    await db.User.update(
      {
        loginAttempts: isFound.loginAttempts,
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
      loginAttempts: 0,
      isLocked: false,
      nextUnlockTime: null,
      lastActivity: moment(),
    },
    { where: { email } },
  );
};

module.exports = {
  register,
  login,
};
