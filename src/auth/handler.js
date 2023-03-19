const { register, login } = require("./service");
const transformResponse = require("../common/transform-response");

exports.register = async (req, res, next) => {
  try {
    await register(req.body);
    transformResponse({
      statusCode: 201,
      res,
      message: "User created successfully",
    });
  } catch (error) {
    next(error)
  }
};

exports.login = async (req, res, next) => {
  try {
    await login(req.body);
    transformResponse({
      statusCode: 200,
      res,
      message: "Login successful",
    })

  } catch (error) {
    next(error)
  }
};