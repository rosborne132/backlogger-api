/* eslint-disable camelcase */
/* eslint-disable no-undef */
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Game Endpoints', function() {
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

  describe(`GET /api/game/:user_id`, () => {
    xcontext('Given there are user games in the database', () => {
      beforeEach('insert games', () => {
        helpers.seedUsers(db, testUsers);
        helpers.seedConsolesTable(db, testConsoles);
        // helpers.seedUserConsoleTable(db, testUserConsoles);
        helpers.seedGamesTable(db, testGames);
      });

      it('responds with 200 and the specified console', () => {
        const user_id = 1;
        const expectedThing = helpers.getUserGames(user_id);

        return supertest(app)
          .get(`/api/game/1`)
          .expect(200, expectedThing);
      });
    });
  });

  describe(`POST /game`, () => {
    beforeEach(() => {
      helpers.seedUsers(db, testUsers);
      helpers.seedConsolesTable(db, testConsoles);
    });
    it(`creates a user game, responding with 201 and the new game`, function() {
      this.retries(3);
      const newUserGame = {
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
      };
      return supertest(app)
        .post(`/api/game`)
        .send(newUserGame)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newUserGame.title);
          expect(res.body.time_to_complete).to.eql(
            newUserGame.time_to_complete
          );
          expect(res.body.notes).to.eql(newUserGame.notes);
          expect(res.body.current_game).to.eql(newUserGame.current_game);
          expect(res.body.summary).to.eql(newUserGame.summary);
          expect(res.body.storyline).to.eql(newUserGame.storyline);
          expect(res.body.game_rating).to.eql(newUserGame.game_rating);
          expect(res.body.game_cover).to.eql(newUserGame.game_cover);
          expect(res.body.console_id).to.eql(newUserGame.console_id);
          expect(res.body.user_id).to.eql(newUserGame.user_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`game/${res.body.user_id}`);
        });
    });

    const requiredFields = [
      'current_game',
      'title',
      'time_to_complete',
      'console_id',
      'user_id',
    ];

    requiredFields.forEach(field => {
      const newUserGame = {
        title: 'Dark Hunter: Shita Youma no Mori',
        time_to_complete: '1-10hrs',
        notes: 'Cant wait to play this game',
        current_game: false,
        summary: 'The second part of the Dark Hunter English teaching tool.',
        storyline: '',
        game_rating: 0.0,
        game_cover: 'image1.com',
        console_id: 3,
        user_id: 2,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUserGame[field];

        return supertest(app)
          .post('/api/game')
          .send(newUserGame)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });

  describe(`DELETE /api/game/:id`, () => {
    context('Given there are games in the database', () => {
      beforeEach(() => {
        helpers.seedUsers(db, testUsers);
        helpers.seedConsolesTable(db, testConsoles);
        helpers.seedGamesTable(db, testGames);
      });

      it('responds with 204 and removes the article', () => {
        const idToRemove = 1;
        const expectedGames = testGames.filter(game => game.id !== idToRemove);
        return supertest(app)
          .delete(`/api/game/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/game`)
              .expect(expectedGames)
          );
      });
    });
  });
});
