const ConsoleService = {
  getAllConsoles(knex) {
    return knex.select('*').from('backlogger_consoles');
  },
  getAllUserConsoles(knex, id) {
    return knex
      .select('*')
      .from('backlogger_user_consoles')
      .where('user_id', id);
  },
  insertUserConsole(knex, newUserConsole) {
    return knex
      .insert(newUserConsole)
      .into('backlogger_user_consoles')
      .returning('*')
      .then(rows => rows[0]);
  },
};

module.exports = ConsoleService;
