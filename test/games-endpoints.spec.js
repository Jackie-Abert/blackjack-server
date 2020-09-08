//tests needed
const gamesRouter = require('./../src/games/games-router')

describe('api/games', () => {
    it('GET / responds with 200', () => {
      supertest(gamesRouter)
        .get('/').then((res)=>{
            expect(res).to.have.status(201);
            done();
        })
    })
  })
//GET to '/'  all games
//GET to '/:game_id'   individual game
//POST to '/' new game to database
//PATCH to '/:game_id' updates game to database
//DELETE to '/:game_id' deletes game from database