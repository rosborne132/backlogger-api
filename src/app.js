// NPM imports
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// LOCAL imports
require('dotenv').config();
const { NODE_ENV } = require('./config');
const errorHandler = require('./errorHandling');
const { testRouter } = require('./routes');

const app = express();

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

// TEST ROUTES
app.use(testRouter);

// Error Handling
app.use(errorHandler);

module.exports = app;
