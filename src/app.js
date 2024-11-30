const express = require("express");
const bodyPaser = require("body-parser");
const routeHandler = require("./router-handler");
const handleError = require("./common/error-handler");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyPaser.urlencoded({ extended: true }));
app.use(bodyPaser.json());
app.use(express.json());
app.use(cookieParser());

routeHandler(app);

app.use(async (err, _req, res, _next) => {
  console.log(err);
  await handleError(err, res);
});

// process.on('uncaughtException', (error) => {
//   handleError(error)
// })

//
module.exports = app;
