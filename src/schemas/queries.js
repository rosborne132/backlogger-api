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
const { ConsoleType, UserConsoleType } = require('./types');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: {
    consoles: {
      type: new GraphQLList(ConsoleType),
      resolve() {
        const knexInstance = app.get('db');
        return consoleService
          .getAllConsoles(knexInstance)
          .then(res => res)
          .catch(err => console.log(err));
      },
    },
    userConsoles: {
      type: new GraphQLList(UserConsoleType),
      resolve(context) {
        console.log(context);
        const user_id = 1;
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
