/* eslint-disable camelcase */
const express = require('express');
const GameService = require('../services/gameService');

const gameRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/basic-auth');

gameRouter.route('/game').post(bodyParser, (req, res, next) => {
  const knexInstance = req.app.get('db');
  const {
    title,
    time_to_complete,
    notes,
    current_game,
    summary,
    storyline,
    game_rating,
    game_id,
    game_cover,
    user_console_id,
    user_id,
  } = req.body;

  const newUserGame = {
    title,
    time_to_complete,
    notes,
    current_game,
    summary,
    storyline,
    game_rating,
    game_id,
    game_cover,
    user_console_id,
    user_id,
  };

  if (user_console_id == null) {
    return res.status(400).json({
      error: { message: `Missing console_id in request body` },
    });
  }

  if (title == null) {
    return res.status(400).json({
      error: { message: `Missing console_id in request body` },
    });
  }

  GameService.insertUserGame(knexInstance, newUserGame)
    .then(games => {
      res
        .status(201)
        .location(`game/${games.console_id}`)
        .json(games);
    })
    .catch(next);
});

gameRouter
  .route('/game/:user_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    GameService.getAllUserGames(knexInstance, req.params.user_id)
      .then(games => {
        res.json(games);
      })
      .catch(err => console.log(err));
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

module.exports = gameRouter;
