/* eslint-disable camelcase */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const AuthService = require('./auth-service');
const app = require('../app');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  const knexInstance = app.get('db');
  AuthService.getUserById(knexInstance, id).then(user => done(null, user));
});

passport.use(
  new LocalStrategy(
    { usernameField: 'user_name' },
    (user_name, password, done) => {
      const knexInstance = app.get('db');
      AuthService.getUserByUserName(knexInstance, user_name).then(dbUser => {
        if (!dbUser) {
          return done(null, false, 'Invalid Credentials');
        }

        return AuthService.comparePasswords(password, dbUser.password).then(
          compareMatch => {
            if (!compareMatch) {
              return done(null, false, 'Invalid credentials.');
            }
            return done(null, dbUser);
          }
        );
      });
    }
  )
);

function signup({ password, user_name, full_name }) {
  if (!user_name || !password)
    throw new Error('You must provide an email and password.');

  const knexInstance = app.get('db');
  return AuthService.getUserByUserName(knexInstance, user_name).then(
    existingUser => {
      if (existingUser) {
        throw new Error('User Name in use');
      } else {
        const passwordError = AuthService.validatePassword(password);
        if (passwordError) throw new Error(passwordError);

        return AuthService.hashPassword(password).then(hashedPassword => {
          const newUser = {
            user_name,
            password: hashedPassword,
            full_name,
            date_created: 'now()',
          };
          return AuthService.insertUser(knexInstance, newUser).then(
            user => user
          );
        });
      }
    }
  );
}

function login({ user_name, password }, req) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (!user) {
        reject('Invalid credentials.');
      }

      req.login(user, () => {
        resolve(user);
      });
    })({ body: { user_name, password } });
  });
}

module.exports = { login, signup };
