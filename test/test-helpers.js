/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      password: 'password',
    },
  ];
}

function makeUsersGamesArray() {
  return [
    {
      id: 1,
      title: 'Dark Hunter: Shita Youma no Mori',
      time_to_complete: '1-10hrs',
      notes: 'Cant wait to play this game',
      current_game: false,
      summary: 'The second part of the Dark Hunter English teaching tool.',
      storyline: '',
      game_rating: 0.0,
      game_cover: 'image1.com',
      console_id: 5,
      user_id: 1,
    },
    {
      id: 2,
      title: 'Call of Duty: Modern Warfare Remastered',
      time_to_complete: '10-20hrs',
      notes: 'I played this game a long time ago, so its been awhile',
      current_game: true,
      summary:
        'One of the most critically-acclaimed games in history. Call of Duty 4: Modern Warfare is back, remastered in true high-definition, featuring enhanced textures, rendering, high-dynamic range lighting, and much more to bring a new generation experience to fans.',
      storyline: '',
      game_rating: 83.36288503620986,
      game_cover: 'image1.com',
      console_id: 1,
      user_id: 2,
    },
    {
      id: 3,
      title: 'test',
      time_to_complete: '20-30hrs',
      notes: 'This test has been a real pain in the butt',
      current_game: false,
      summary: 'This is a test game',
      storyline: '',
      game_rating: 2.5,
      game_cover: 'image.com',
      console_id: 1,
      user_id: 1,
    },
  ];
}

function makeConsolesArray() {
  return [
    {
      id: 1,
      title: 'Xbox 360',
    },
    {
      id: 2,
      title: 'Gameboy Color',
    },
    {
      id: 3,
      title: 'Nintendo DS',
    },
    {
      id: 4,
      title: 'PS Vita',
    },
    {
      id: 5,
      title: 'Switch',
    },
  ];
}

function makeUsersConsolesArray() {
  return [
    {
      id: 1,
      user_id: 1,
      console_id: 5,
    },
    {
      id: 2,
      user_id: 2,
      console_id: 1,
    },
    {
      id: 3,
      user_id: 1,
      console_id: 2,
    },
    {
      id: 4,
      user_id: 3,
      console_id: 4,
    },
    {
      id: 5,
      user_id: 3,
      console_id: 3,
    },
    {
      id: 6,
      user_id: 4,
      console_id: 1,
    },
  ];
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into('backlogger_users')
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('backlogger_users_id_seq', ?)`, [
        preppedUsers[preppedUsers.length - 1].id,
      ])
    );
}

function seedConsolesTable(db, consoles) {
  return db
    .into('backlogger_consoles')
    .insert(consoles)
    .then(() =>
      db.raw(`SELECT setval('backlogger_consoles_id_seq', ?)`, [
        consoles[consoles.length - 1].id,
      ])
    );
}

function seedGamesTable(db, games) {
  return db
    .into('backlogger_user_games')
    .insert(games)
    .then(() =>
      db.raw(`SELECT setval('backlogger_user_games_id_seq', ?)`, [
        games[games.length - 1].id,
      ])
    );
}

function seedUserConsoleTable(db, consoles) {
  return db
    .into('backlogger_user_consoles')
    .insert(consoles)
    .then(() =>
      db.raw(
        `SELECT setval('backlogger_user_consoles_id_seq', (SELECT MAX(id) FROM backlogger_user_consoles))`
      )
    );
}

function getUserConsoles(id) {
  const userConsoles = makeUsersConsolesArray();
  const expectedResults = userConsoles.filter(
    console => console.user_id === id
  );
  return expectedResults;
}

function makeBacklogFixtures() {
  const testUsers = makeUsersArray();
  const testGames = makeUsersGamesArray(testUsers);
  const testConsoles = makeConsolesArray();
  const testUserConsoles = makeUsersConsolesArray();

  return {
    testUsers,
    testConsoles,
    testUserConsoles,
    testGames,
  };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      backlogger_consoles,
      backlogger_users,
      backlogger_user_consoles,
      backlogger_user_games
      RESTART IDENTITY CASCADE`
  );
}

function seedConsoleTables(db, users, consoles, userConsoles) {
  return db
    .into('backlogger_users')
    .insert(users)
    .then(() => db.into('backlogger_consoles').insert(consoles))
    .then(() => db.into('backlogger_user_consoles').insert(userConsoles));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  // const token = jwt.sign({ user_id: user.id }, secret, {
  //   subject: user.user_name,
  //   algorithm: 'HS256',
  // });
  const token = Buffer.from(`${user.user_name}:${user.password}`).toString(
    'base64'
  );
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeUsersGamesArray,
  makeConsolesArray,
  makeUsersConsolesArray,
  getUserConsoles,

  makeBacklogFixtures,
  cleanTables,
  seedConsoleTables,
  makeAuthHeader,
  seedUsers,
  seedConsolesTable,
  seedUserConsoleTable,
  seedGamesTable,
};
