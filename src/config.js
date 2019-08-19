module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL:
    process.env.NODE_ENV === 'development'
      ? process.env.DB_URL
      : process.env.DATABASE_URL,
  TEST_DB_URL: 'postgresql://postgres@localhost/backlogger-test',
  CLIENT_ORIGIN_LOCAL: 'http://localhost:3000/',
  CLIENT_ORIGIN_PROD: 'https://backlogger-app.rosborne132.now.sh/',
  SESSION_SECRECT: process.env.SESSION_SECRECT || 'change-this-secret',
};
