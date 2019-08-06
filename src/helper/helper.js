// /* eslint-disable camelcase */
// const AuthService = require('../auth/auth-service');
// const { requireAuth } = require('../middleware/jwt-auth');
// const UsersService = require('../users/users-service');

// const app = require('../app');

// const createUser = (password, user_name, full_name, req) => {
//   //   const { password, user_name, full_name } = req.body;

//   for (const field of ['full_name', 'user_name', 'password'])
//     if (!req.body[field])
//       return res.status(400).json({
//         error: `Missing '${field}' in request body`,
//       });
//   const passwordError = UsersService.validatePassword(password);

//   if (passwordError) return res.status(400).json({ error: passwordError });

//   UsersService.hasUserWithUserName(req.app.get('db'), user_name).then(
//     hasUserWithUserName => {
//       if (hasUserWithUserName)
//         return res.status(400).json({ error: `Username already taken` });

//       return UsersService.hashPassword(password).then(hashedPassword => {
//         const newUser = {
//           user_name,
//           password: hashedPassword,
//           full_name,
//           date_created: 'now()',
//         };

//         return UsersService.insertUser(app.get('db'), newUser).then(user => {
//           res
//             .status(201)
//             .location(path.posix.join(req.originalUrl, `/${user.id}`))
//             .json(UsersService.serializeUser(user));
//         });
//       });
//     }
//   );
// };

// const loginUser = (user_name, password, req) => {
//   // const { user_name, password } = req.body;
//   const loginUser = { user_name, password };

//   const knexInstance = app.get('db');

//   AuthService.getUserWithUserName(knexInstance, loginUser.user_name).then(
//     dbUser => {
//       console.log(dbUser);

//       if (!dbUser)
//         return res.status(400).json({
//           error: 'Incorrect user_name or password',
//         });

//       return AuthService.comparePasswords(
//         loginUser.password,
//         dbUser.password
//       ).then(
//         compareMatch =>
//           // if (!compareMatch)
//           //   return res.status(400).json({
//           //     error: 'Incorrect user_name or password',
//           //   });

//           ({
//             id: dbUser.id,
//             user_name: dbUser.user_name,
//           })

//         // const sub = dbUser.user_name;
//         // const payload = { user_id: dbUser.id };
//         // return {
//         //   authToken: AuthService.createJwt(sub, payload),
//         // };
//         // res.send({
//         //   authToken: AuthService.createJwt(sub, payload),
//         // });
//       );
//     }
//   );
// };

// module.exports = { createUser, loginUser };
