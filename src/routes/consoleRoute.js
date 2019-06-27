/* eslint-disable camelcase */
const express = require('express');
const ConsoleService = require('../services/consoleService');

const consoleRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/basic-auth');

consoleRouter
  .route('/console')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ConsoleService.getAllConsoles(knexInstance)
      .then(consoles => {
        if (!consoles) {
          return res.status(404).json({
            error: { message: `Console does not exist` },
          });
        }
        res.json(consoles);
      })
      .catch(next);
  })
  // .post(bodyParser, (req, res, next) => {
  .post(requireAuth, bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { console_id } = req.body;
    const newUserConsole = { console_id };
    newUserConsole.user_id = req.user.id;
    console.log(newUserConsole);

    ConsoleService.insertUserConsole(knexInstance, newUserConsole)
      .then(consoles => {
        res
          .status(201)
          .location(`console/${consoles.console_id}`)
          .json(consoles);
      })
      .catch(next);
  });

consoleRouter
  .route('/consoles')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    const user_id = req.user.id;
    ConsoleService.getAllUserConsoles(knexInstance, user_id)
      .then(consoles => {
        if (!consoles) {
          return res.status(404).json({
            error: { message: `Console does not exist` },
          });
        }
        res.json(consoles);
      })
      .catch(next);
  });

module.exports = consoleRouter;
