// /* eslint-disable camelcase */
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const jwt = require('jsonwebtoken');
// const AuthService = require('./auth-service');
// const UserService = require('../users/users-service');
// const app = require('../app');

// // SerializeUser is used to provide some identifying token that can be saved
// // in the users session.  We traditionally use the 'ID' for this.
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// // the user object.  This object is placed on 'req.user'.
// passport.deserializeUser((id, done) => {
//   const knexInstance = app.get('db');
//   AuthService.findById(knexInstance, id).then((err, user) => {
//     done(err, user);
//   });
// });

// // Instructs Passport how to authenticate a user using a locally saved email
// // and password combination.  This strategy is called whenever a user attempts to
// // log in.  We first find the user model in MongoDB that matches the submitted email,
// // then check to see if the provided password matches the saved password. There
// // are two obvious failure points here: the email might not exist in our DB or
// // the password might not match the saved one.  In either case, we call the 'done'
// // callback, including a string that messages why the authentication process failed.
// // This string is provided back to the GraphQL client.
// passport.use(
//   new LocalStrategy(
//     { usernameField: 'user_name' },
//     (user_name, password, done) => {
//       const knexInstance = app.get('db');
//       AuthService.getUserWithUserName(knexInstance, user_name).then(dbUser => {
//         if (!dbUser) {
//           return done(null, false, 'Invalid Credentials');
//         }

//         return AuthService.comparePasswords(password, dbUser.password).then(
//           compareMatch => {
//             if (!compareMatch) {
//               return done(null, false, 'Invalid credentials.');
//             }
//             return done(null, dbUser);
//           }
//         );
//       });
//     }
//   )
// );

// // Creates a new user account.  We first check to see if a user already exists
// // with this email address to avoid making multiple accounts with identical addresses
// // If it does not, we save the existing user.  After the user is created, it is
// // provided to the 'req.logIn' function.  This is apart of Passport JS.
// // Notice the Promise created in the second 'then' statement.  This is done
// // because Passport only supports callbacks, while GraphQL only supports promises
// // for async code!  Awkward!
// function signup({ email, password, req }) {
//   const user = new User({ email, password });
//   if (!email || !password) {
//     throw new Error('You must provide an email and password.');
//   }

//   return User.findOne({ email })
//     .then(existingUser => {
//       if (existingUser) {
//         throw new Error('Email in use');
//       }
//       return user.save();
//     })
//     .then(
//       user =>
//         new Promise((resolve, reject) => {
//           req.logIn(user, err => {
//             if (err) {
//               reject(err);
//             }
//             resolve(user);
//           });
//         })
//     );
// }

// // Logs in a user.  This will invoke the 'local-strategy' defined above in this
// // file. Notice the strange method signature here: the 'passport.authenticate'
// // function returns a function, as its indended to be used as a middleware with
// // Express.  We have another compatibility layer here to make it work nicely with
// // GraphQL, as GraphQL always expects to see a promise for handling async code.
// function login({ user_name, password, req, res }) {
//   return new Promise((resolve, reject) => {
//     passport.authenticate('local', { session: true }, (err, user) => {
//       if (!user) {
//         reject('Invalid credentials.');
//       }

//       console.log('Hitting up the loging function');

//       req.login(user, () => {
//         resolve(user);
//       });
//     })({ body: { user_name, password } });
//   });
// }

// module.exports = { signup, login };
