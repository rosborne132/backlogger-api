const express = require('express');
const path = require('path');
const ConsoleService = require('../services/consoleService');

const consoleRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/basic-auth');

async function checkUserConsolesExists(req, res, next) {
  try {
    const consoles = await ConsoleService.getAllUserConsoles(
      req.app.get('db'),
      req.params.user_id
    );

    if (!consoles)
      return res.status(404).json({
        error: `Console does not exist`,
      });

    res.consoles = consoles;
    next();
  } catch (error) {
    next(error);
  }
}

consoleRouter.route('/console').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  ConsoleService.getAllConsoles(knexInstance)
    .then(consoles => {
      res.json(consoles);
    })
    .catch(next);
});

consoleRouter
  .route('/console/:user_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ConsoleService.getAllUserConsoles(knexInstance, req.params.user_id)
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
  .post('/consoles', (req, res, next) => {
    res.status(201).send('stuff');
  });

module.exports = consoleRouter;
