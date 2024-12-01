const { signToken } = require("../../common/jwt");

const ACCESS_TOKEN_EXPIRATION = 60 * 30;
const REFRESH_TOKEN_EXPIRATION = 60 * 60;

const generateAccessToken = (data) =>
  signToken(data, "ACCESS_TOKEN", ACCESS_TOKEN_EXPIRATION);

const generateRefreshToken = (data) =>
  signToken(data, "REFRESH_TOKEN", REFRESH_TOKEN_EXPIRATION);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
