const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// LOCAL imports
require('dotenv').config();
const { NODE_ENV, CLIENT_ORIGIN_LOCAL } = require('./config');
const errorHandler = require('./errorHandling');
const { consoleRouter } = require('./routes');

const app = express();

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN_LOCAL,
  })
);

app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.use(consoleRouter);

// Error Handling
app.use(errorHandler);

module.exports = app;
