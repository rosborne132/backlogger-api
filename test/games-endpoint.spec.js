/* eslint-disable no-undef */
/* eslint-disable camelcase */
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Game Endpoints', function() {
  let db;

  const { testUsers, testConsoles, testGames } = helpers.makeBacklogFixtures();

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
    context('Given there are user games in the database', () => {
      beforeEach('insert games', () => {
        helpers.seedUsers(db, testUsers);
        helpers.seedConsolesTable(db, testConsoles);
        helpers.seedGamesTable(db, testGames);
      });

      it('responds with 200 and the specified user games', () => {
        const user_id = 1;
        return supertest(app)
          .get(`/api/game/${user_id}`)
          .expect(200);
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
        console_id: 2,
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
    ];

    requiredFields.forEach(field => {
      const newUserGame = {
        title: 'Dark Hunter: Shita Youma no Mori',
        time_to_complete: '1-10hrs',
        current_game: false,
        console_id: 5,
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

      it('responds with 204 and removes the game', () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/game/${idToRemove}`)
          .expect(204);
      });
    });
  });

  describe(`PATCH /api/game/:game_id`, () => {
    context('Given there are games in the database', () => {
      beforeEach(() => {
        helpers.seedUsers(db, testUsers);
        helpers.seedConsolesTable(db, testConsoles);
        helpers.seedGamesTable(db, testGames);
      });

      it('responds with 204 and updates the game', () => {
        const idToUpdate = 1;
        const updateGame = {
          title: 'Dark Hunter',
          time_to_complete: '10-20hrs',
          notes:
            'After playing this game for a little bit, I think its going to take longer than expected',
          current_game: true,
          console_id: 5,
        };

        return supertest(app)
          .patch(`/api/game/${idToUpdate}`)
          .send(updateGame)
          .expect(204);
      });
    });
  });
});
