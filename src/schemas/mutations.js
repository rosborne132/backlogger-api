/* eslint-disable camelcase */
const graphql = require('graphql');
const app = require('../app');
const { consoleService } = require('../services/consoleService');

const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;
const { ConsoleType } = require('./types');

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: {
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
