require('dotenv').config();
var createError = require("http-errors");
var express = require("express");
const app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
require("./models/db");

app.use(require("cors")({ credentials: true, origin: true }));

var logger = require("morgan");
app.use(express.json());

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

app.use("/", indexRouter);
app.use("/users", usersRouter);


// app.use(express.static("./AIFRONTEND/build"));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "AIFRONTEND", "build", "index.html"));
// });


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});



module.exports = { app };
