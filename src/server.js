const uuid = require('uuid');

const knex = require('knex');
const graphql = require('graphql');
const expressGraphQL = require('express-graphql');

const { ApolloServer } = require('apollo-server-express');

const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');

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

const SESSION_SECRECT = 'bad secret';

app.use(
  session({
    genid: req => uuid(),
    secret: SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
