const config = require('../../config');

module.exports = {
  development: {
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.name'),
    dialect: config.get('db.dialect'),
    host: config.get('db.host'),
    logging: console.log
  },
  test: {
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.name'),
    dialect: config.get('db.dialect'),
    logging: false
  },
  production: {
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.name'),
    dialect: config.get('db.dialect'),
    host: config.get('db.host'),
    logging: false
  }
}
