const GameService = {
  getMaxGameId(knex) {
    return knex
      .select('id')
      .from('backlogger_user_games')
      .orderBy('id', 'desc')
      .first();
  },
  getUserGame(knex, id) {
    return knex
      .select('*')
      .from('backlogger_user_games')
      .where({ id })
      .first();
  },
  getAllUserGames(knex, id) {
    return knex
      .select('*')
      .from('backlogger_user_games')
      .where('user_id', id);
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
      .delete()
      .then(game => game);
  },
  updateUserGame(knex, id, newGameFields) {
    return knex('backlogger_user_games')
      .where({ id })
      .update(newGameFields)
      .returning('*')
      .then(rows => rows[0]);
  },
};

module.exports = GameService;
