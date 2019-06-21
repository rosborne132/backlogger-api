/* eslint-disable no-undef */
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Console Endpoints', function() {
  let db;

  const {
    testUsers,
    testConsoles,
    testUserConsoles,
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

  describe(`GET /api/console`, () => {
    context(`Given no console`, () => {
      it(`responds with 200 and an empty list`, () =>
        supertest(app)
          .get('/api/console')
          .expect(200, []));
    });

    context('Given there are things in the database', () => {
      beforeEach('insert console', () =>
        helpers.seedConsoleTables(db, testUsers, testConsoles, testUserConsoles)
      );

      it('responds with 200 and all of the things', () => {
        const expectedThings = helpers.makeConsolesArray();

        return supertest(app)
          .get('/api/console')
          .expect(200, expectedThings);
      });
    });
  });

  describe(`GET /api/console/:user_id`, () => {
    context('Given there are consoles in the database', () => {
      beforeEach('insert consoles', () =>
        helpers.seedConsoleTables(db, testUsers, testConsoles, testUserConsoles)
      );

      it('responds with 200 and the specified console', () => {
        const user = 3;
        const expectedThing = helpers.getUserConsoles(user);

        return supertest(app)
          .get(`/api/console/${user}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, expectedThing);
      });
    });
  });

  describe(`POST /console`, () => {
    beforeEach(() => {
      helpers.seedUsers(db, testUsers);
      helpers.seedConsolesTable(db, testConsoles);
    });
    it(`creates an console, responding with 201 and the new console`, function() {
      this.retries(3);
      const newUserConsole = {
        user_id: 2,
        console_id: 3,
      };
      return supertest(app)
        .post(`/api/console`)
        .send(newUserConsole)
        .expect(201)
        .expect(res => {
          expect(res.body.user_id).to.eql(newUserConsole.user_id);
          expect(res.body.console_id).to.eql(newUserConsole.console_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`console/${res.body.console_id}`);
        });
    });
  });
});
