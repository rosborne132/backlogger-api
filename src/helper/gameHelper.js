/* eslint-disable camelcase */
const GameService = require('../services/gameService');

const app = require('../app');

const insertUserGame = (gameArgs, id) => {
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
  } = gameArgs;

  const user_id = id;

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
      throw new Error(`Missing '${key}' in request body`);
    }
  }

  const knexInstance = app.get('db');
  return GameService.insertUserGame(knexInstance, newUserGame)
    .then(games => games)
    .catch(err => console.log(err));
};

const editUserGame = gameArgs => {
  const { id } = gameArgs;

  const {
    title,
    time_to_complete,
    notes,
    current_game,
    console_id,
    is_complete,
  } = gameArgs;

  const gameToUpdate = {
    title,
    time_to_complete,
    notes,
    current_game,
    console_id,
    is_complete,
  };

  const knexInstance = app.get('db');
  return GameService.updateUserGame(knexInstance, id, gameToUpdate)
    .then(updatedGame => updatedGame)
    .catch(err => console.log(err));
};

const deleteUserGame = id => {
  const knexInstance = app.get('db');

  return GameService.deleteUserGame(knexInstance, id)
    .then(deletedGameId => deletedGameId)
    .catch(err => console.log(err));
};

module.exports = { editUserGame, deleteUserGame, insertUserGame };
