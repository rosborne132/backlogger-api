/* eslint-disable camelcase */
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } = graphql;
const { consoleService, gameService } = require('../services');
const app = require('../app');

const ConsoleType = new GraphQLObjectType({
  name: 'Console',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
  },
});

const UserConsoleType = new GraphQLObjectType({
  name: 'UserConsole',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
  }),
});

module.exports = { ConsoleType, UserConsoleType };
