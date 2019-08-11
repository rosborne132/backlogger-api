const { ApolloServer } = require('apollo-server-express');
const graphql = require('graphql');
const knex = require('knex');

const app = require('./app');

const { GraphQLSchema } = graphql;
const { mutation } = require('./schemas/mutations');
const { PORT, DB_URL } = require('./config');
const query = require('./schemas/queries');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

app.set('db', db);

const schema = new GraphQLSchema({
  query,
  mutation,
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    user: req.user,
    logout: () => req.logout(),
    req,
  }),
});

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);
