module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN || 'dummy-api-token',
    CLIENT_ORIGIN:process.env.CLIENT_ORIGIN,
    DATABASE_URL:process.env.DATABASE_URL,
  }