const mongoose = require("mongoose");
const express = require("express");
const app = express();
const userRouter = require("./routes/user.js");
const { connectMongoDb } = require("./connection");
const {logReqRes} = require("./middlewares");

//  Connection
connectMongoDb("mongodb://127.0.0.1:27017/nodejs-tut")
  .then(console.log('mongoDB connected'));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'));

// Routes
app.use("/user", userRouter);

app.listen(3000, () => {
  console.log("Server created successfully!");
});
