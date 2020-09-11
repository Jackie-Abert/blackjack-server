/* eslint-disable no-undef */
const expect = require("chai").expect;
const supertest = require("supertest");
const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("api/games", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  context("given there are games and user in the database", () => {
    const testUsers = [
      { id: 1, user_name: "bob", password: "$2a$10$60mn6Tr0/pKZp0vq7r9PrO4fW5H5IPjF/GViXB1VB1Sv4ocRs/n62" },
      { id: 2, user_name: "dave", password: "$2a$10$60mn6Tr0/pKZp0vq7r9PrO4fW5H5IPjF/GViXB1VB1Sv4ocRs/n62" },
      { id: 3, user_name: "jenny", password: "$2a$10$60mn6Tr0/pKZp0vq7r9PrO4fW5H5IPjF/GViXB1VB1Sv4ocRs/n62" },
    ];

    const testGames = [
      {
        id: 1,
        bank: 360055,
        wins: 9,
        losses: 22,
        moneywon: null,
        user_id: 1,
      },
      {
        id: 2,
        bank: 10200,
        wins: 3,
        losses: 5,
        moneywon: null,
        user_id: 2,
      },
      {
        id: 3,
        bank: 56000,
        wins: 66,
        losses: 4,
        moneywon: null,
        user_id: 3,
      },
    ];

    beforeEach("insertgames and users", () => {
      return helpers.seedGamesTables(db, testUsers, testGames)
    });

    it("GET / make this pass responds with 200", () => {
      const testUser = testUsers[0];
      const expectedGames = testGames.filter(game => game.user_id === testUser.id).map(game => {
        delete game.user_id
        return game
      })
      return supertest(app)
        .get("/api/game")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(200, expectedGames);
    });

    it("GET /:game_id responds with 200 and game", () => {
      const gameId = 1;
      const testUser = testUsers[0];
      const expectedGame = testGames[gameId - 1];
      return supertest(app)
        .get(`/api/game/${gameId}`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(200, expectedGame);
    });

    it("POST / posts new game to database", () => {
      const testUser = testUsers[0];
      const newGame = {
        bank: 2500,
        wins: 10,
        losses: 5,
        user_id: testUser.id,
      };
      return supertest(app)
        .post("/api/game")
        .send(newGame)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(201)
        .expect((res) => {
          expect(res.body.bank).to.eql(newGame.bank);
          expect(res.body.wins).to.eql(newGame.wins);
          expect(res.body.losses).to.eql(newGame.losses);
          expect(res.body).to.have.property("id");
        })
        .then((res) =>
          supertest(app)
            .get(`/api/game/${res.body.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .expect(res.body)
        );
    });

    it("PATCH / responds with 204 and updates the game", () => {
      const gameId = 1;
      const testUser = testUsers[0];
      const updateGame = {
        bank: 2500,
        wins: 10,
        losses: 5,
        // user_id: testUser.id,
      };
      const expectedGame = {
        ...testGames[gameId - 1],
        ...updateGame,
      };
      return supertest(app)
        .patch(`/api/game/${gameId}`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(updateGame)
        .expect(204)
        .then(() =>
          supertest(app)
            .get(`/api/game/${gameId}`)
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .expect(expectedGame)
        );
    });
    it("DELETE / deletes game from database", () => {
      const testUser = testUsers[0];
      const gameId = 1;
      const expectedGame = testGames.filter((game) => game.id !== gameId);
      return supertest(app)
        .delete(`/api/game/${gameId}`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(204)
        .then(() => 
          supertest(app)
          .get(`/api/game/`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(expectedGame)
        );
    });
  });
});
