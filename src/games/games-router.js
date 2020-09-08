const express = require("express");
const path = require('path')
const GamesService = require("./games-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonBodyParser = express.json();
const { v4: uuidv4 } = require('uuid');
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
    const { bank, wins, losses, } = req.body;
    const newGame = { bank, wins, losses };
    for (const [key, value] of Object.entries(newGame))
      if (value == null)
        return res.status(400).json({
          error: {message:`Missing '${key}' in request body`}
        });
    newGame.user_id=req.user.id
    console.log(newGame,)
    GamesService.insertGame(
      req.app.get('db'),
      newGame
    )

    .then(game => {
        res
        .status(201)
        // .location(path.posix.join(req.originalUrl, `/${id}`))
        .json(game);
      })
      .catch(next);
  });
  //updates games in the database
  gamesRouter
  .route("/:game_id")
  .patch(requireAuth, checkGame, jsonBodyParser, (req, res, next) => {
    const { bank, wins, losses } = req.body;
    const gameUpdate = { bank, wins, losses };
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

  /////deletes game by id
  .delete((req, res, next) => {
    GamesService.deleteGame(
      req.app.get('db'),
      req.params.game_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = gamesRouter;
