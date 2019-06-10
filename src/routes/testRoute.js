const express = require('express');
const path = require('path');

const testRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/basic-auth');

testRouter.route('/test').get((req, res) => {
  res.send('Hello from test');
});

module.exports = testRouter;
