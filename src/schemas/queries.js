/* eslint-disable camelcase */
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');
const { consoleService, gameService } = require('../services');

const app = require('../app');
const {
  ConsoleType,
  UserConsoleType,
  UserGames,
  UserType,
} = require('./types');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: {
    dummyField: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue, args, { user }) {
        return user;
      },
    },
    consoles: {
      type: new GraphQLList(ConsoleType),
      resolve(parentValue, args, context) {
        const knexInstance = app.get('db');

        return consoleService
          .getAllConsoles(knexInstance)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
    userConsoles: {
      type: new GraphQLList(UserConsoleType),
      resolve(parentValue, args, { user }) {
        const knexInstance = app.get('db');
        return consoleService
          .getAllUserConsoles(knexInstance, user.id)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
    userGames: {
      type: new GraphQLList(UserGames),
      resolve(parentValue, args, { user }) {
        const knexInstance = app.get('db');
        return gameService
          .getAllUserGames(knexInstance, user.id)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
    userGame: {
      type: UserGames,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, { id }) {
        const knexInstance = app.get('db');
        return gameService
          .getUserGame(knexInstance, id)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
  },
});

module.exports = RootQuery;
