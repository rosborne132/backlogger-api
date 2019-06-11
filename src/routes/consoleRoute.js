const express = require('express');
const path = require('path');
const ConsoleService = require('../services/consoleService');

const consoleRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/basic-auth');

consoleRouter.route('/consoles').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  ConsoleService.getAllConsoles(knexInstance)
    .then(consoles => {
      res.json(consoles);
    })
    .catch(next);
});

module.exports = consoleRouter;
