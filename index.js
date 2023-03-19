const db = require("./src/models");
const app = require('./src/app');
const config = require('./config');
const port = config.get('port');
const env = config.get('env');

db.sequelize.sync()
  .then(() => {
    if (env !== 'test') {
      console.log("Synced db.");
    }
  })
  .catch((err) => {
    if (env !== 'test') {
      console.log("Failed to sync db: " + err.message);
    }
  })

if (env !== 'test') {
  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
}

module.exports = app;
