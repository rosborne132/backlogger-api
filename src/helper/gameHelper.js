const gameService = require('../services/gameService');

const app = require('../app');

const insertUserGame = (gameArgs, id) => {
  console.log(gameArgs);
  console.log(id);
};

module.exports = { insertUserGame };
