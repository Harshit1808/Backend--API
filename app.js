const dotenv = require("dotenv");
let express = require("express");
let logger = require("morgan");
const cors = require("cors");

const session = require('express-session');
let app = express();
global.__root = __dirname + "/";
dotenv.config({path: './config.env' });
const db = require("./db");
app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: 'any secret', cookie: { secure: false }, key: 'id' }));
app.all("*", (req, resp, next) => {
  
    let obj = {
      Host: req.headers.host,
      ContentType: req.headers['content-type'],
      Url: req.originalUrl,
      Method: req.method,
      Query: req.query,
      Body: req.body,
      headers: req.Authorization,
      Parmas: req.params[0]
    }
    console.log("Common Request is===========>", [obj])
    next();
  });
const AuthController = require("./controllers/authController");
app.use("/api/auth", AuthController);

module.exports = app;

