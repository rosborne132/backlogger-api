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
      nickname: 'TU1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
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

// function makeGamesArray(users) {
//   return [
//     {
//       id: 1,
//       title: 'First test thing!',
//       image: 'http://placehold.it/500x500',
//       user_id: users[0].id,
//       date_created: '2029-01-22T16:28:32.615Z',
//       content:
//         'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
//     },
//   ];
// }

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
      console_id: 1,
    },
    {
      id: 2,
      user_id: 2,
      console_id: 5,
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

// function makeMaliciousThing(user) {
//   const maliciousThing = {
//     id: 911,
//     image: 'http://placehold.it/500x500',
//     date_created: new Date().toISOString(),
//     title: 'Naughty naughty very naughty <script>alert("xss");</script>',
//     user_id: user.id,
//     content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
//   };
//   const expectedThing = {
//     ...makeExpectedThing([user], maliciousThing),
//     title:
//       'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
//     content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
//   };
//   return {
//     maliciousThing,
//     expectedThing,
//   };
// }

function makeThingsFixtures() {
  const testUsers = makeUsersArray();
  // const testGames = makeGamesArray(testUsers);
  const testConsoles = makeConsolesArray();
  const testUserConsoles = makeUsersConsolesArray();

  return { testUsers, testConsoles, testUserConsoles };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      backlogger_consoles,
      backlogger_users,
      backlogger_user_consoles
      RESTART IDENTITY CASCADE`
  );
}

// function seedThingsTables(db, users, things, reviews = []) {
//   return db
//     .into('thingful_users')
//     .insert(users)
//     .then(() => db.into('thingful_things').insert(things))
//     .then(() => reviews.length && db.into('thingful_reviews').insert(reviews));
// }

// function seedMaliciousThing(db, user, thing) {
//   return seedUsers(db, [user]).then(() =>
//     db.into('thingful_things').insert([thing])
//   );
// }

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  // makeGamesArray,
  makeConsolesArray,
  // makeMaliciousThing,
  makeUsersConsolesArray,

  makeThingsFixtures,
  cleanTables,
  // seedThingsTables,
  // seedMaliciousThing,
  makeAuthHeader,
  seedUsers,
};
