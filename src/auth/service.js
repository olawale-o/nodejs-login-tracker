const moment = require("moment");
const db = require("../models");
const AppError = require("../common/app-error");
const { hashPassword, comparePassword } = require("./helpers/password-helper");
const {
  generateAccessToken,
  generateRefreshToken,
  generateAccessTokenWithUserIdAndVersionId,
} = require("./helpers/auth-token");
const { generateToken } = require("../common/crypto");
const { findByEmail, insertOne } = require("./orm");

const LOCK_TIME = 1;
const MAX_LOGIN_ATTEMPTS = 3;
const PASSWORD_EXPIRES = 3;


const register = async (credentials) => {
  const { email, fullName, password } = credentials;
  const isFound = await findByEmail({email})
  if (isFound) {
    throw new AppError(
      400,
      "Email already exists. Please login with your credentials",
    );
    
  }
  const hashedPassword = await hashPassword(password);
  const user = await insertOne({
    fullName: fullName,
    email,
    password: hashedPassword,
  })
  return user;
};

const login = async (credentials) => {
  const { email, password } = credentials;
  const isFound = await findByEmail({ email });
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

  // Refresh Tokens for Long-Lived Sessions strategy
  const accessToken = generateAccessToken({ id: isFound.id });
  const refreshToken = generateRefreshToken({ id: isFound.id });

  // REPLACE ABOVE 2 TOKENs WITH THIS ONE FOR TOKEN VERSION STRATEGY
  // put the token in cookies or authorization header
  // const token = generateAccessTokenWithUserIdAndVersionId({
  //   id: isFound.id,
  //   tokenVersion: isFound.tokenVersion,
  // });

  await db.Token.create({
    accessToken,
    refreshToken,
    user_id: isFound.id,
  });

  await db.User.update(
    {
      loginAttempts: 0,
      isLocked: false,
      nextUnlockTime: null,
      lastActivity: moment(),
    },
    { where: { email } },
  );
  return {
    accessToken,
    refreshToken,
  };
};

const forgotPassword = async (credentials) => {
  const { email } = credentials;
  const isFound = await findByEmail({ email });
  if (!isFound) {
    throw new AppError(400, "Please provide a valid email address");
  }

  const token = generateToken();
  await db.User.update(
    {
      resetPasswordToken: token,
      resetPasswordExpires: moment().add(PASSWORD_EXPIRES, "minutes").valueOf(),
    },
    { where: { email } },
  );

  return { token };
};

const resetPassword = async (credentials) => {
  const {
    query: { token },
    body: { password },
  } = credentials;
  const isFound = await db.User.findOne({
    where: { resetPasswordToken: token },
  });

  if (!isFound) {
    throw new AppError(401, "Please provide a valid token");
  }

  if (isFound.resetPasswordToken !== token) {
    throw new AppError(401, "Please provide a valid token");
  }

  if (moment().isAfter(isFound.resetPasswordExpires)) {
    throw new AppError(403, "Reset has expired");
  }

  const hashedPassword = await hashPassword(password);

  await db.User.update(
    {
      resetPasswordToken: null,
      resetPasswordExpires: null,
      password: hashedPassword,
    },
    { where: { email: isFound.email } },
  );
};

// const changePassword = asyn (credentials) => {}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
