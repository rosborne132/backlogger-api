/* eslint-disable camelcase */
const graphql = require('graphql');
const app = require('../app');
const consoleService = require('../services/consoleService');

const gameHelpers = require('../helper/gameHelper');

const AuthService = require('../auth/auth');

const {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} = graphql;
const { ConsoleType, UserGames, UserType } = require('./types');

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        user_name: { type: GraphQLString },
        password: { type: GraphQLString },
        full_name: { type: GraphQLString },
      },
      resolve(parentValue, { password, user_name, full_name }) {
        return AuthService.signup({ password, user_name, full_name });
      },
    },
    login: {
      type: UserType,
      args: {
        user_name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, { user_name, password }, context) {
        return AuthService.login({ user_name, password }, context.req);
      },
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, context) {
        const { user } = context;
        context.logout();
        return user;
      },
    },
    addUserConsole: {
      type: ConsoleType,
      args: { console_id: { type: GraphQLID } },
      resolve(parentValue, { console_id }, context) {
        const newUserConsole = {
          user_id: context.user.id,
          console_id,
        };

        const knexInstance = app.get('db');
        return consoleService
          .insertUserConsole(knexInstance, newUserConsole)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
    addUserGame: {
      type: UserGames,
      args: {
        title: { type: GraphQLString },
        time_to_complete: { type: GraphQLString },
        notes: { type: GraphQLString },
        current_game: { type: GraphQLBoolean },
        summary: { type: GraphQLString },
        story: { type: GraphQLString },
        game_rating: { type: GraphQLFloat },
        game_cover: { type: GraphQLString },
        console_id: { type: GraphQLString },
      },
      resolve(parentValue, args, { user }) {
        gameHelpers.insertUserGame(args, user.id);
      },
    },
  },
});

exports.mutation = RootMutation;
