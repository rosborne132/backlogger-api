const GameService = {
  getAllUserGames(knex, id) {
    return knex
      .select('*')
      .from('backlogger_user_games')
      .where('game_user_id', id);
  },
  insertUserGame(knex, newUserGame) {
    return knex
      .insert(newUserGame)
      .into('backlogger_user_games')
      .returning('*')
      .then(rows => rows[0]);
  },
  deleteUserGame(knex, id) {
    return knex('backlogger_user_games')
      .where({ id })
      .delete();
  },
  updateUserGame(knex, id, newGameFields) {
    return knex('backlogger_user_games')
      .where({ id })
      .update(newGameFields);
  },
};

module.exports = GameService;
