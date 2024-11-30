const jwt = require("jsonwebtoken");

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret, (err, data) => {
    if (err) {
      throw new Error(err);
    }
    return data;
  });
};

module.exports = verifyToken;
