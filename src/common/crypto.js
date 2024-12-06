const crypto = require("crypto");

const generateToken = () => crypto.randomBytes(20).toString("hex");

module.exports = {
  generateToken,
};
