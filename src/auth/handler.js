const { register, login } = require("./service");
const transformResponse = require("../common/transform-response");
const db = require("../models");
const AppError = require("../common/app-error");

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
    const { accessToken, refreshToken } = await login(req.body);
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    transformResponse({
      statusCode: 200,
      res,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const isTokenFound = await db.Token.findOne({ where: { refreshToken } });
    if (!isTokenFound) {
      throw new AppError(403, "Token is invalid");
    }

    await db.Token.destroy({ where: { refreshToken } });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    next(e);
  }
};
