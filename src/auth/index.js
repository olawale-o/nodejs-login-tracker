const router = require("express").Router();
const {
  validateRequestSchema,
  registerSchema,
  loginSchema,
} = require("./validations/auth.validation");

const handler = require("./handler");
const { authenticateToken } = require("../middlewares/auth");

router.post(
  "/register",
  validateRequestSchema(registerSchema),
  handler.register,
);
router.post("/login", validateRequestSchema(loginSchema), handler.login);
router.post("/logout", authenticateToken, handler.logout);

module.exports = router;
