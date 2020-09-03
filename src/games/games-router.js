const express = require("express");
const GamesService = require("./games-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonBodyParser = express.json();
const checkGame = require('../middleware/checkGameExists')

const gamesRouter = express.Router();

//gets all games linked to user
gamesRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    GamesService.getAllGames(req.app.get("db"), req.user.id)
      .then((games) => {
        res.json(games);
      })
      .catch(next);
  });
//gets individual game data
gamesRouter
  .route("/:game_id")
  .get(requireAuth, checkGame,(req, res, next) => {
    res.json(req.game)
  });
//posts new game data to database
gamesRouter
  .route("/")
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { bank, wins, losses, moneywon} = req.body;
    const newGame = { bank, wins, losses, moneywon};
    for (const [key, value] of Object.entries(newGame))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    newGame.user_id = req.user_id;

    GamesService.insertGame(req.app.get("db"), newGame)
      .then((game) => {
        res
        .status(201)
        .location(path.join(req.originalUrl, `/${game.id}`))
        .json(game);
      })
      .catch(next);
  });
  //updates games in the database
  gamesRouter
  .route("/:game_id")
  .patch(requireAuth, checkGame, jsonBodyParser, (req, res, next) => {
    const { bank, wins, losses, moneywon } = req.body;
    const gameUpdate = { bank, wins, losses, moneywon };
    GamesService.updateGame(
      req.app.get('db'),
      req.params.game_id,
      gameUpdate
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })

module.exports = gamesRouter;
