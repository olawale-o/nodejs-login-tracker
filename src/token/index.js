const router = require("express").Router();
const { refresh } = require("./handler");

router.post("/", refresh);

module.exports = router;
