const bcrypt = require('bcryptjs')

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
         return db
           .insert(newUser)
           .into('users')
           .returning('*')
           .then(([user]) => user)
       },
    validatePassword(password) {
      if (password.length < 8) {
        return 'Password must be longer than 8 characters'
      }
      if (password.length > 72) {
        return 'Password must be less than 72 characters'
      }
    },
    hashPassword(password) {
      return bcrypt.hash(password, 12)
    },

  }
  
  module.exports = UsersService