const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

describe("Auth Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  describe("Protected endpoints", () => {
    it(`Responds 401 'Missing token' when no bearer token`, () => {
      return supertest(app)
        .post(`/login`)
        .expect(401, { error: `Missing bearer token` });
    });
  });
});

