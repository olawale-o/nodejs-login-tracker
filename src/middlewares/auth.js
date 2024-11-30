const moment = require("moment");
const verifyToken = require("../common/verify-token");
const AppError = require("../common/app-error");

const IDLE_TIMEOUT = 15;

const sessionExpired = async (req, res, next) => {
  const now = moment();
  const idleTime = now - new Date();
};

const authenticateToken = (req, _res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new AppError(401, "Access token is required");
  }

  try {
    const data = verifyToken(accessToken, "ACCESS_TOKEN");
    if (!data) {
      throw new AppError(403, "Token verification failed 1");
    }
    req.user = data;
    next();
  } catch (e) {
    throw new AppError(403, "Token verification failed 2");
  }
};

module.exports = {
  authenticateToken,
};
