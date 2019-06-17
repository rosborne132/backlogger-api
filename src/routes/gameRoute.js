/* eslint-disable camelcase */
const express = require('express');
const GameService = require('../services/gameService');

const consoleRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/basic-auth');

consoleRouter.route('/game').post(bodyParser, (req, res, next) => {
  const knexInstance = req.app.get('db');
  const {
    name,
    time_to_complete,
    notes,
    current_game,
    summary,
    storyline,
    game_rating,
    game_id,
    console_id,
    game_cover,
    user_id,
  } = req.body;

  const newUserGame = {
    name,
    time_to_complete,
    notes,
    current_game,
    summary,
    storyline,
    game_rating,
    game_id,
    console_id,
    game_cover,
    user_id,
  };

  GameService.insertUserGame(knexInstance, newUserGame)
    .then(games => {
      res
        .status(201)
        .location(`game/${games.console_id}`)
        .json(games);
    })
    .catch(next);
});

consoleRouter
  .route('/game/:user_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    GameService.getAllUserGames(knexInstance, req.params.user_id)
      .then(games => {
        if (!games) {
          return res.status(404).json({
            error: { message: `Game does not exist` },
          });
        }
        res.json(games);
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const {
      name,
      time_to_complete,
      notes,
      current_game,
      game_id,
      console_id,
    } = req.body;

    const gameToUpdate = {
      name,
      time_to_complete,
      notes,
      current_game,
      game_id,
      console_id,
    };

    GameService.updateUserGame(
      req.app.get('db'),
      req.params.user_id,
      gameToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { game_id } = req.params;
    const knexInstance = req.app.get('db');

    GameService.deleteUserGame(knexInstance, game_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = consoleRouter;
