const router = require('express').Router();
const {
  validateRequestSchema,
  registerSchema,
  loginSchema,
} = require('./validations/auth.validation');

const handler = require('./handler');

router.post('/register', validateRequestSchema(registerSchema), handler.register);
router.post('/login', validateRequestSchema(loginSchema), handler.login);

module.exports = router;
