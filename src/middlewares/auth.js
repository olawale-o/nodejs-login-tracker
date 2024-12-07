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
  const { token } = req.cookies; // or athourization header;

  if (!token) {
    throw new AppError(401, "Token is required");
  }

  try {
    const decoded = verifyToken(token, "ACCESS_TOKEN");
    if (!decoded) {
      throw new AppError(403, "Token verification failed 1");
    }

    // compare tokenVersion with the one in the database
    const user = await checkTokenVersion(decoded.id);

    if (!user) {
      throw new AppError(403, "Please provide valid credentials");
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError(403, "Token version is invalid");
    }
    req.data = decoded;
    next();
  } catch (e) {
    next(new AppError(403, "Token verification failed"));
  }
};

module.exports = {
  authenticateToken,
  authenticateTokenByVersion,
};
