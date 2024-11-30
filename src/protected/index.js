const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");

router.get("/", (req, res, next) => {
  res.status(200).send("You can view this route");
});

module.exports = router;
