const { signToken } = require("../../common/jwt");

const ACCESS_TOKEN_EXPIRATION = 60 * 30;
const REFRESH_TOKEN_EXPIRATION = 60 * 60;

const generateJWTToken = (data, key, expires) => signToken(data, key, expires);

const generateAccessToken = (data) =>
  generateJWTToken(data, "ACCESS_TOKEN", ACCESS_TOKEN_EXPIRATION);

const generateRefreshToken = (data) =>
  generateJWTToken(data, "REFRESH_TOKEN", REFRESH_TOKEN_EXPIRATION);

const generateAccessTokenWithUserIdAndVersionId = (data) =>
  generateJWTToken(data, "TOKEN_VERSION", ACCESS_TOKEN_EXPIRATION);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateAccessTokenWithUserIdAndVersionId,
};
