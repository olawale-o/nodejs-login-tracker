const jwt = require("jsonwebtoken");

const signToken = (data, secret, expiresIn) =>
  jwt.sign(data, secret, { expiresIn: expiresIn });

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret, (err, data) => {
    if (err) {
      throw new Error(err);
    }
    return data;
  });
};

module.exports = {
  signToken,
  verifyToken,
};
