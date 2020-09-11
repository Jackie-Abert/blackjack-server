/* eslint-disable no-undef */
const expect = require("chai").expect;
const supertest = require("supertest");
const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Auth Endpoints", () => {
  let db;
  const testUsers = [
    { id: 1, user_name: "bob", password: "password123" },
    { id: 2, user_name: "dave", password: "password123" },
    { id: 3, user_name: "jenny", password: "password123" },
  ];
  before("make knex instance", () => {
      
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))
  
  
  
  describe(`POST /api/auth/login`, () => {
    beforeEach("insertgames and users", () => {
      db.into("users").insert(testUsers);

      it(`AUTH POINTS / responds 200 and JWT auth token using secret when valid credentials`, () => {
        const testUser = {user_name:'Billy', password:'password123'}

        const userValidCreds = {
          user_name: testUser.user_name,
          password: testUser.password,
        };
        const expectedToken = jwt.sign(
          { user_id: testUser.id }, // payload
          process.env.JWT_SECRET,
          {
            subject: testUser.user_name,
            algorithm: "HS256",
          }
        );
        return supertest(app)
          .post("/api/auth/login")
          .send(userValidCreds)
          .expect(200, {
            authToken: expectedToken,
          });
      });
    });
  });
});
