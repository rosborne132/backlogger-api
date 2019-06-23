const ConsoleService = {
  getAllConsoles(knex) {
    return knex.select('*').from('backlogger_consoles');
  },
  getAllUserConsoles(knex, id) {
    return knex
      .select('uc.*', 'c.title')
      .from('backlogger_user_consoles AS uc')
      .join('backlogger_consoles AS c', 'uc.console_id', 'c.id')
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
