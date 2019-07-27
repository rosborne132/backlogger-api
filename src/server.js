const knex = require('knex');
const graphql = require('graphql');
const graphqlHTTP = require('express-graphql');
const app = require('./app');

const { PORT, DB_URL } = require('./config');

const { GraphQLSchema } = graphql;

const { mutation } = require('./schemas/mutations');
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

app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema,
    context: { req },
    graphiql: true,
  }))
);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
