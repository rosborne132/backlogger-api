const UserService = {
  getAllUsers(knex) {
    return knex.select('*').from('backlogger_users');
  },
};

module.exports = UserService;
