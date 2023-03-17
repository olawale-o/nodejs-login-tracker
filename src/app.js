const express = require("express");
const bodyPaser = require("body-parser");
const routeHandler = require("./router-handler");
const app = express();

app.use(bodyPaser.urlencoded({ extended: true }))
app.use(bodyPaser.json())
app.use(express.json())

//Url
app.use(bodyPaser.urlencoded({extended: true}));
app.use(bodyPaser.json());

routeHandler(app);

//
module.exports = app;