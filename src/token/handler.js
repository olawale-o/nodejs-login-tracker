const {
  generateAccessToken,
  generateRefreshToken,
} = require("../auth/helpers/auth-token");
const AppError = require("../common/app-error");
const { verifyToken } = require("../common/jwt");
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
