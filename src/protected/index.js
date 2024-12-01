const router = require("express").Router();

router.get("/", (req, res, next) => {
  // console.log(req.headers);
  res.status(200).send("You can view this route");
});

module.exports = router;
