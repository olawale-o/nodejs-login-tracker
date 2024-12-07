const {
  generateAccessToken,
  generateRefreshToken,
} = require("../auth/helpers/auth-token");
const AppError = require("../common/app-error");
const { verifyToken } = require("../common/jwt");
const db = require("../models");

// token refresh through new token generation
// Refresh Tokens for Long-Lived Sessions
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.cookies; // or authourization header;
    if (!refreshToken) {
      throw new AppError(401, "Token is required");
    }

    const isFound = await db.Token.findOne({ where: { refreshToken: token } });

    if (!isFound) {
      throw new AppError(403, "Token is invalid");
    }

    const decoded = verifyToken(token, "REFRESH_TOKEN");

    if (!decoded) {
      throw new AppError(403, "Token verification failed");
    }

    const accessToken = generateAccessToken({ id: decoded.id }, "ACCESS_TOKEN");
    const refreshToken = generateRefreshToken(
      { id: decoded.id },
      "REFRESH_TOKEN",
    );

    await db.Token.create({
      accessToken,
      refreshToken,
      user_id: isFound.user_id,
    });

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    return res.status(200).json({ message: "Token refreshed" });
  } catch (e) {
    next(e);
  }
};

// token refresh through version strategy
// Token Versioning strategy
// you cant refresh a token for this strategy
exports.version = async (req, res, next) => {
  try {
    const { token } = req.cookies; // or authourization header;
    if (!token) {
      throw new AppError(401, "Token is required");
    }
    // it is assumed that the payload contains tokenVersion
    const decoded = verifyToken(token, "TOKEN_VERSION");

    if (!decoded) {
      throw new AppError(403, "Token verification failed");
    }

    const user = await db.User.findOne({ where: { id: decoded.id } });
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError(403, "Token version is invalid");
    }
  } catch (e) {
    next(e);
  }
};
