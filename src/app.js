const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
// const passport = require('passport');
// const session = require('express-session');
// const bodyParser = require('body-parser');

// const initPassport = require('./auth/passport-config');

// initPassport(passport);

require('dotenv').config();
const { NODE_ENV } = require('./config');
const errorHandler = require('./errorHandling');
const { consoleRouter, gameRouter } = require('./routes');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: 'aaabbbccc',
//   })
// );

// app.use(bodyParser.json());

// app.use(passport.initialize());
// app.use(passport.session());

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);

app.use(cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.options('*', cors());

app.use(helmet());

app.use('/api/', consoleRouter);
app.use('/api/', gameRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

module.exports = app;
