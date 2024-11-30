const verifyToken = require("../common/verify-token");
const AppError = require("../common/app-error");

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

module.exports = {
  authenticateToken,
};
