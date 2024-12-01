const { verifyToken } = require("../common/jwt");
const AppError = require("../common/app-error");
const db = require("../models");

const checkTokenVersion = async (id) => {
  await db.User.findOne({ where: { id } });
};

const authenticateToken = async (req, _res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new AppError(401, "Access token is required");
  }

  try {
    const data = verifyToken(accessToken, "ACCESS_TOKEN");
    if (!data) {
      throw new AppError(403, "Token verification failed 1");
    }
    req.data = data;
    next();
  } catch (e) {
    next(new AppError(403, "Token verification failed"));
  }
};

const authenticateTokenByVersion = async (req, _res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new AppError(401, "Access token is required");
  }

  try {
    const decoded = verifyToken(accessToken, "ACCESS_TOKEN");
    if (!decoded) {
      throw new AppError(403, "Token verification failed 1");
    }

    // compare tokenVersion with the one in the database
    const tokenVersion = await checkTokenVersion(decoded.tokenVersion);

    if (tokenVersion !== decoded.tokenVersion) {
      throw new AppError(403, "Token version is invalid");
    }
    req.data = data;
    next();
  } catch (e) {
    next(new AppError(403, "Token verification failed"));
  }
};

module.exports = {
  authenticateToken,
  authenticateTokenByVersion,
};
