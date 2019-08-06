/* eslint-disable camelcase */
const graphql = require('graphql');
const app = require('../app');
const { consoleService } = require('../services/consoleService');
// const AuthService = require('../auth/auth-service');
const { createUser, loginUser } = require('../helper/helper');

const AuthService = require('../auth/auth');

const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;
const { ConsoleType, UserType } = require('./types');

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: {
    // signup: {
    //   type: UserType,
    //   args: {
    //     user_name: { type: GraphQLString },
    //     password: { type: GraphQLString },
    //     full_name: { type: GraphQLString },
    //   },
    //   resolve(parentValue, args, req) {
    //     console.log(req);
    //     const { password, user_name, full_name } = args;
    //     createUser(password, user_name, full_name, req);
    //   },
    // },
    // login: {
    //   type: UserType,
    //   args: {
    //     user_name: { type: GraphQLString },
    //     password: { type: GraphQLString },
    //   },
    //   resolve(parentValue, args, req) {
    //     const { password, user_name } = args;
    //     // return loginUser(user_name, password, req).then(res => res);
    //     const knexInstance = app.get('db');

    //     return AuthService.getUserWithUserName(knexInstance, user_name).then(
    //       res => {
    //         console.log(res);
    //         return res;
    //       }
    //     );
    //   },
    // },
    login: {
      type: UserType,
      args: {
        user_name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, { user_name, password }, req, res) {
        return AuthService.login({ user_name, password, req, res });
      },
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req;
        console.log(user);
        req.logout();
        return user;
      },
    },
    addUserConsole: {
      type: ConsoleType,
      args: {
        console_id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const { console_id } = args;

        const newUserConsole = {
          user_id: 1,
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
