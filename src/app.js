require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const authRouter = require('./auth/auth-router')
const app = express();
const gamesRouter = require('./games/games-router')
const usersRouter = require('./users/users-router')

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(helmet());
app.use(cors());

app.use('/api/game', gamesRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
