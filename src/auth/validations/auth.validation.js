const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateRequestSchema = (schema) => (req, res, next) => {
  const { value, error } = Joi.compile(schema).validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
  
    return next(new AppError(
      422,
      errorMessage,
    ));
  }
  Object.assign(req, value);
  return next();
};


module.exports = {
  registerSchema,
  loginSchema,
  validateRequestSchema
};