/* eslint-disable camelcase */
const express = require('express');
const GameService = require('../services/gameService');

const gameRouter = express.Router();
const bodyParser = express.json();

const { requireAuth } = require('../middleware/jwt-auth');

gameRouter.route('/game').post(requireAuth, bodyParser, (req, res, next) => {
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
  } = req.body;

  const user_id = req.user.id;

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

gameRouter
  .route('/games')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    const user_id = req.user.id;
    GameService.getAllUserGames(knexInstance, user_id)
      .then(games => {
        res.json(games);
      })
      .catch(err => console.log(err));
  });

gameRouter
  .route('/game/:game_id')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { game_id } = req.params;
    GameService.getUserGame(knexInstance, game_id)
      .then(games => {
        res.json(games);
      })
      .catch(err => console.log(err));
  })
  .patch(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { game_id } = req.params;
    const {
      title,
      time_to_complete,
      notes,
      current_game,
      console_id,
      is_complete,
    } = req.body;

    const gameToUpdate = {
      title,
      time_to_complete,
      notes,
      current_game,
      console_id,
      is_complete,
    };

    GameService.updateUserGame(knexInstance, game_id, gameToUpdate)
      .then(updatedGame => {
        res.json(updatedGame);
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
