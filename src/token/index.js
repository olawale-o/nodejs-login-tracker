const router = require("express").Router();
const { refresh, version } = require("./handler");

router.post("/", refresh);
router.post("/version", version);

module.exports = router;
