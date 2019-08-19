/* eslint-disable camelcase */
const graphql = require('graphql');
const app = require('../app');
const consoleService = require('../services/consoleService');

const AuthService = require('../auth/auth');

const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;
const { ConsoleType, UserType } = require('./types');

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
      resolve(parentValue, args, req) {
        const { user } = req;
        req.logout();
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
  },
});

exports.mutation = RootMutation;
