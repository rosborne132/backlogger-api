/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('backlogger_users')
      .where({ user_name })
      .first();
  },
  getUserById(db, id) {
    return db('backlogger_users')
      .where({ id })
      .first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
};

module.exports = AuthService;
