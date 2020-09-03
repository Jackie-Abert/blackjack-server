const GamesService = {
  getAllGames(db, user_id) {
    return db
      .from("game_table AS g")
      .select("g.id", "g.bank", "g.wins", "g.losses", "g.moneywon")
      .where("g.user_id", user_id);
  },

  getThisGame(db, id, user_id) {
    return db
      .from("game_table AS game")
      .select("*")
      .where({"game.id":id, user_id})
      .first();
  },

  insertGame(db, newGame) {
    return db
      .insert(newGame)
      .into("game_table")
      .returning("*")
      .then(([game]) => game)
      .then((game) => GamesService.getThisGame(db, game.id));
  },

  updateGame(db, id, newGame) {
    return db
      .from('game_table')
      .where("game.id", id)
      .update(newGame)
  }
};

module.exports = GamesService;
