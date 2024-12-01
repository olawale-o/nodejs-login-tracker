const { accessToken, refreshToken } = require("../auth/helpers/jwt");
const AppError = require("../common/app-error");
const verifyToken = require("../common/verify-token");
const db = require("../models");

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.cookies;
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

    const tokenAccess = accessToken({ id: decoded.id }, "ACCESS_TOKEN");
    const tokenRefresh = refreshToken({ id: decoded.id }, "REFRESH_TOKEN");

    await db.Token.create({
      accessToken: tokenAccess,
      refreshToken: tokenRefresh,
      user_id: isFound.user_id,
    });

    res.cookie("accessToken", tokenAccess, { httpOnly: true, secure: true });
    res.cookie("refreshToken", tokenRefresh, { httpOnly: true, secure: true });
    return res.status(200).json({ message: "Token refreshed" });
  } catch (e) {
    next(e);
  }
};
