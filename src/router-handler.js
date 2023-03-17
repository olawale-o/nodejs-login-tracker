module.exports = (app) => {
  app.use('/api/v1/auth', require('./auth'));
}