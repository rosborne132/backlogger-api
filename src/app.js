const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// LOCAL imports
require('dotenv').config();
const { NODE_ENV, CLIENT_ORIGIN_LOCAL } = require('./config');
const errorHandler = require('./errorHandling');
const { consoleRouter, gameRouter } = require('./routes');

const app = express();

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);

// app.use(
//   cors({
//     origin: CLIENT_ORIGIN_LOCAL,
//   })
// );

app.use(cors());

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};
app.use(allowCrossDomain);

app.use(helmet());

app.use('/api/', consoleRouter);
app.use('/api/', gameRouter);

// Error Handling
app.use(errorHandler);

module.exports = app;
