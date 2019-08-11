/* eslint-disable camelcase */
const LocalStrategy = require('passport-local').Strategy;

const app = require('../app');
const AuthService = require('./auth-service');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const knexInstance = app.get('db');
    const dbUser = AuthService.getUserWithUserName(knexInstance, email);
    if (dbUser == null) {
      return done(null, false, { message: 'No user with that email' });
    }

    try {
      if (AuthService.comparePasswords(password, dbUser.password)) {
        return done(null, dbUser);
      }
      return done(null, false, { message: 'Password incorrect' });
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((dbUser, done) => done(null, dbUser.id));
  passport.deserializeUser((id, done) => {
    const knexInstance = app.get('db');
    return done(null, AuthService.getUserById(knexInstance, id));
  });
}

module.exports = initialize;
