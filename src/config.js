module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://backlogger@localhost/backlogger',
  TEST_DB_URL: 'postgresql://postgres@localhost/backlogger-test',
  CLIENT_ORIGIN_LOCAL: 'http://localhost:3000/',
  CLIENT_ORIGIN_PROD: 'https://backlogger-app.rosborne132.now.sh/',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
};
