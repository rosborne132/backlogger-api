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

function makeGameCovers() {
  return [
    {
      id: 1,
      game_cover_id: 60970,
      game_cover_url: 'testGameImageCover.com',
    },
    {
      id: 2,
      game_cover_id: 24920,
      game_cover_url: 'testGameImageCover.com',
    },
  ];
}

function makeGamesArray(users) {
  return [
    {
      id: 1,
      name: 'Dark Hunter: Shita Youma no Mori',
      time_to_complete: '1-10hrs',
      notes: 'Cant wait to play this game',
      current_game: false,
      summary: 'The second part of the Dark Hunter English teaching tool.',
      storyline: '',
      game_rating: 0.0,
      game_id: 24920,
      console_id: 5,
      game_cover: 60970,
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      name: 'Call of Duty: Modern Warfare Remastered',
      time_to_complete: '10-20hrs',
      notes: 'I played this game a long time ago, so its been awhile',
      current_game: true,
      summary:
        'One of the most critically-acclaimed games in history. Call of Duty 4: Modern Warfare is back, remastered in true high-definition, featuring enhanced textures, rendering, high-dynamic range lighting, and much more to bring a new generation experience to fans.',
      storyline: '',
      game_rating: 83.36288503620986,
      game_id: 24920,
      console_id: 1,
      game_cover: 18457,
      user_id: users[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
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
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('backlogger_users_id_seq', ?)`, [
        users[users.length - 1].id,
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

function seedGameImagesTable(db, gameImages) {
  return db
    .into('backlogger_game_images')
    .insert(gameImages)
    .then(() =>
      db.raw(`SELECT setval('backlogger_consoles_id_seq', ?)`, [
        gameImages[gameImages.length - 1].id,
      ])
    );
}

function seedGamesTable(db, games) {
  return db
    .into('backlogger_user_games')
    .insert(games)
    .then(() =>
      db.raw(`SELECT setval('backlogger_consoles_id_seq', ?)`, [
        games[games.length - 1].id,
      ])
    );
}

function getUserConsoles(id) {
  const userConsoles = makeUsersConsolesArray();
  const expectedResults = userConsoles.filter(
    console => (console.user_id = id)
  );
  return expectedResults;
}

function makeBacklogFixtures() {
  const testUsers = makeUsersArray();
  const testGames = makeGamesArray(testUsers);
  const testConsoles = makeConsolesArray();
  const testUserConsoles = makeUsersConsolesArray();
  const gameCoverImages = makeGameCovers();

  return {
    testUsers,
    testConsoles,
    testUserConsoles,
    testGames,
    gameCoverImages,
  };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      backlogger_consoles,
      backlogger_users,
      backlogger_user_consoles,
      backlogger_user_games,
      backlogger_game_images
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
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeGamesArray,
  makeConsolesArray,
  makeUsersConsolesArray,
  getUserConsoles,

  makeBacklogFixtures,
  cleanTables,
  seedConsoleTables,
  makeAuthHeader,
  seedUsers,
  seedConsolesTable,
  seedGameImagesTable,
  seedGamesTable,
};
