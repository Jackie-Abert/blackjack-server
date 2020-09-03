const GamesService = require("../games/games-service");

function checkGame(req, res, next) {

    GamesService.getThisGame(req.app.get("db"), req.params.game_id, req.user.id)
    .then((game) => {
      if(game) {
          req.game = game
          return next()
      }
      return res.status(404).json({
        error: { message: `Game doesn't exist` }})
    })
    .catch(next);
}

module.exports = 
  checkGame
;
