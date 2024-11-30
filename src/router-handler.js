const { authenticateToken } = require("./middlewares/auth");
const sessionExpired = require("./middlewares/session-expired");

module.exports = (app) => {
  app.use("/api/v1/auth", require("./auth"));
  app.use(
    "/api/v1/protected",
    authenticateToken,
    sessionExpired,
    require("./protected"),
  );
};
