/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
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
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
      return `Bearer ${token}`
  }

  function seedGamesTables(db, users, games) {
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('game_table').insert(games)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('game_table_id_seq', ?)`,
          [games[games.length - 1].id],
        ),
      ])
    })
  }
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          game_table,
          users
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE game_table_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('game_table_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
        ])
      )
    )
  }

  module.exports = {
    makeAuthHeader,
    cleanTables,
    seedGamesTables,
    testUsers,
    testGames
  }