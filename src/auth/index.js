const router = require("express").Router();
const {
  validateRequestSchema,
  registerSchema,
  loginSchema,
  forgotPassword,
} = require("./validations/auth.validation");

const handler = require("./handler");
const { authenticateToken } = require("../middlewares/auth");

router.post(
  "/register",
  validateRequestSchema(registerSchema),
  handler.register,
);
router.post("/login", validateRequestSchema(loginSchema), handler.login);
router.post(
  "/forgot_password",
  validateRequestSchema(forgotPassword),
  handler.forgotPassword,
);
router.post("/reset_password", handler.resetPassword);
router.post("/logout", authenticateToken, handler.logout);

module.exports = router;
