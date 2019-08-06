/* eslint-disable camelcase */
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');
const { consoleService } = require('../services');

const app = require('../app');
const { ConsoleType, UserConsoleType, UserType } = require('./types');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: {
    dummyField: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        // console.log(req.user);
        // return req.user;
      },
    },
    consoles: {
      type: new GraphQLList(ConsoleType),
      resolve(parentValue, args, req) {
        const knexInstance = app.get('db');
        console.log(req.user);

        return consoleService
          .getAllConsoles(knexInstance)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
    userConsoles: {
      type: new GraphQLList(UserConsoleType),
      resolve(parentValue, args, req) {
        // console.log(req);
        const user_id = 2;
        console.log(req.user);
        // const user_id = context.req.user.id;
        const knexInstance = app.get('db');
        return consoleService
          .getAllUserConsoles(knexInstance, user_id)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
  },
});

module.exports = RootQuery;
