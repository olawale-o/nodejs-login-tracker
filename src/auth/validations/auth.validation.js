const Joi = require('joi');
const AppError = require('../../common/app-error');

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
  const { value, error } = Joi.compile(schema).validate(req.body,  { abortEarly: false });
  if (error) {
    const errors = error.details
      .map((details) => ({
        [details.context.key]: details.message.replace(/"/g, ''),
      }))
  
    throw new AppError(
      422,
      errors,
    );
  }
  Object.assign(req, value);
  return next();
};


module.exports = {
  registerSchema,
  loginSchema,
  validateRequestSchema
};