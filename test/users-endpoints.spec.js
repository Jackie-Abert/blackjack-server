/* eslint-disable no-undef */
//POST to 'auth/users/newuser  posting new user to database

const expect = require("chai").expect;
const supertest = require("supertest");
const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe('Users endpoint', () => {
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

  it("POST / posts new user to database", () => {
      const newUser = {
          user_name:'testuser',
          password: 'testtest123'
      }
      return supertest(app)
      .post('/api/users/newuser')
      .send(newUser)
      .expect(201)
      .expect((res) => {
          expect(res.body.user_name).to.eql(newUser.user_name)
      })
  })
})

