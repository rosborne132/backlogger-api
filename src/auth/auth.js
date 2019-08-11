/* eslint-disable camelcase */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AuthService = require('./auth-service');
const UserService = require('../users/users-service');
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
      AuthService.getUserWithUserName(knexInstance, user_name).then(dbUser => {
        if (!dbUser) {
          return done(null, false, 'Invalid Credentials');
        }

        return AuthService.comparePasswords(password, dbUser.password).then(
          compareMatch => {
            if (!compareMatch) {
              return done(null, false, 'Invalid credentials.');
            }
            // console.log(dbUser);
            return done(null, dbUser);
          }
        );
      });
    }
  )
);

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
function signup({ password, user_name, full_name }, req) {
  console.log(user_name);
  console.log(password);
  console.log(full_name);
  // console.log(req.headers);
  // const user = new User({ email, password });
  // if (!email || !password) {
  //   throw new Error('You must provide an email and password.');
  // }
  // return User.findOne({ email })
  //   .then(existingUser => {
  //     if (existingUser) {
  //       throw new Error('Email in use');
  //     }
  //     return user.save();
  //   })
  //   .then(
  //     user =>
  //       new Promise((resolve, reject) => {
  //         req.logIn(user, err => {
  //           if (err) {
  //             reject(err);
  //           }
  //           resolve(user);
  //         });
  //       })
  //   );
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
