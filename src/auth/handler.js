const { register, login, forgotPassword, resetPassword } = require("./service");
const transformResponse = require("../common/transform-response");
const db = require("../models");
const AppError = require("../common/app-error");

const invalidateUserTokenVersion = async (userId) => {
  await db.User.update(
    { tokenVersion: user.tokenVersion++ },
    { where: { id: userId } },
  );
};

exports.register = async (req, res, next) => {
  try {
    await register(req.body);
    transformResponse({
      statusCode: 201,
      res,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, data } = await login(req.body);
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    transformResponse({
      statusCode: 200,
      res,
      data,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { token } = await forgotPassword(req.body);
    transformResponse({
      statusCode: 200,
      res,
      message: {
        text: "Kindly check your mail for password reset instruction",
        url: `http://localhost:5000/api/v1/auth/reset_password?token=${token}`,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await resetPassword({ query: req.query, body: req.body });
    transformResponse({
      statusCode: 200,
      res,
      message: "Password reset sucessfull",
    });
  } catch (e) {
    next(e);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { id } = req.data;
    const tokenFound = await db.Token.findOne({ where: { refreshToken } });
    if (!tokenFound) {
      throw new AppError(403, "Token is invalid");
    }
    if (tokenFound.user_id !== id) {
      throw new AppError(403, "Ioken is invalid");
    }

    // use this if you are long live session token strategy
    await db.Token.destroy({ where: { refreshToken } });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });

    // uncomment below if you are using token version strateggy
    // await invalidateUserTokenVersion(id)
  } catch (e) {
    next(e);
  }
};
