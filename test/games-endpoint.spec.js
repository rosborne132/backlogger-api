/* eslint-disable camelcase */
/* eslint-disable no-undef */
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Game Endpoints', function() {
  let db;

  const {
    testUsers,
    testConsoles,
    testUserConsoles,
    testGames,
  } = helpers.makeBacklogFixtures();

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    });

    return `Bearer ${token}`;
  }

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe.only(`GET /api/game/:user_id`, () => {
    xcontext(`Given no games`, () => {
      beforeEach(() => {
        helpers.seedUsers(db, testUsers);
        helpers.seedGamesTable(db, testGames);
      });

      it(`responds with 404`, () => {
        const userId = '';
        return supertest(app)
          .get(`/api/game/${userId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: `Games do not exist`,
          });
      });
    });

    context('Given there are user games in the database', () => {
      beforeEach('insert games', () => {
        helpers.seedUsers(db, testUsers);
        helpers.seedConsolesTable(db, testConsoles);
        helpers.seedUserConsoleTable(db, testUserConsoles);
        helpers.seedGamesTable(db, testGames);
      });

      it('responds with 200 and the specified console', () => {
        const user_id = 1;
        const expectedThing = helpers.getUserGames(user_id);

        return supertest(app)
          .get(`/api/game/1`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, expectedThing);
      });
    });
  });

  //   describe(`POST /console`, () => {
  //     beforeEach(() => {
  // helpers.seedUsers(db, testUsers);
  // helpers.seedGamesTable(db, testGames);
  //     });
  //     it(`creates an console, responding with 201 and the new console`, function() {
  //       // this.retries(3);
  //       const newUserConsole = {
  //         user_id: 2,
  //         console_id: 3,
  //       };
  //       return supertest(app)
  //         .post(`/api/console`)
  //         .send(newUserConsole)
  //         .expect(201)
  //         .expect(res => {
  //           expect(res.body.user_id).to.eql(newUserConsole.user_id);
  //           expect(res.body.console_id).to.eql(newUserConsole.console_id);
  //           expect(res.body).to.have.property('id');
  //           expect(res.headers.location).to.eql(`console/${res.body.console_id}`);
  //         });
  //     });
  //   });
});
