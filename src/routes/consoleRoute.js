/* eslint-disable camelcase */
const express = require('express');
const ConsoleService = require('../services/consoleService');

const consoleRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/basic-auth');

consoleRouter
  .route('/console')
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
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { console_id, user_id } = req.body;
    const newUserConsole = { console_id, user_id };

    ConsoleService.insertUserConsole(knexInstance, newUserConsole)
      .then(consoles => {
        res
          .status(201)
          .location(`console/${consoles.console_id}`)
          .json(consoles);
      })
      .catch(next);
  });

consoleRouter.route('/console/:user_id').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  const { user_id } = req.params;
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
