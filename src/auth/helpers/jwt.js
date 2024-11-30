const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRATION = 60 * 30;
const REFRESH_TOKEN_EXPIRATION = 60 * 60;

const accessToken = (data) => {
  return jwt.sign(data, "ACCESS_TOKEN", { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

const refreshToken = (data) => {
  return jwt.sign(data, "REFRESH_TOKEN", {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

module.exports = {
  accessToken,
  refreshToken,
};
