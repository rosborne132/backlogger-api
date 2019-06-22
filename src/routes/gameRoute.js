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
    game_cover,
    console_id,
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
    game_cover,
    console_id,
    user_id,
  };

  const requiredFields = {
    current_game,
    title,
    time_to_complete,
    console_id,
    user_id,
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });
    }
  }

  GameService.insertUserGame(knexInstance, newUserGame)
    .then(games => {
      res
        .status(201)
        .location(`game/${games.user_id}`)
        .json(games);
    })
    .catch(err => console.log(err));
});

gameRouter.route('/game/:user_id').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  const { user_id } = req.params;
  GameService.getAllUserGames(knexInstance, user_id)
    .then(games => {
      res.json(games);
    })
    .catch(err => console.log(err));
});

gameRouter
  .route('/game/:game_id')
  .patch(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { game_id } = req.params;
    const {
      title,
      time_to_complete,
      notes,
      current_game,
      console_id,
    } = req.body;

    const gameToUpdate = {
      title,
      time_to_complete,
      notes,
      current_game,
      console_id,
    };

    GameService.updateUserGame(knexInstance, game_id, gameToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(err => console.log(err));
  })
  .delete((req, res, next) => {
    const { game_id } = req.params;
    const knexInstance = req.app.get('db');

    GameService.deleteUserGame(knexInstance, game_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(err => console.log(err));
  });

module.exports = gameRouter;
