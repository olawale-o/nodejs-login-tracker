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
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await login(req.body);
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    transformResponse({
      statusCode: 200,
      res,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};
