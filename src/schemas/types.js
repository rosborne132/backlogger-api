/* eslint-disable camelcase */
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    userName: { type: GraphQLString },
    password: { type: GraphQLString },
    fullName: { type: GraphQLString },
  },
});

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

const UserGames = new GraphQLObjectType({
  name: 'UserGames',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    time_to_complete: { type: GraphQLString },
    notes: { type: GraphQLString },
    current_game: { type: GraphQLBoolean },
    summary: { type: GraphQLString },
    story: { type: GraphQLString },
    game_rating: { type: GraphQLFloat },
    game_cover: { type: GraphQLString },
    console_id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    date_created: { type: GraphQLString },
    is_complete: { type: GraphQLBoolean },
  }),
});

module.exports = { ConsoleType, UserConsoleType, UserGames, UserType };
