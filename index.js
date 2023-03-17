const db = require("./src/models");
const app = require('./src/app');
const port = process.env.PORT || 3000


db.sequelize.sync()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log("Synced db.");
    }
  })
  .catch((err) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log("Failed to sync db: " + err.message);
    }
  })

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
}

module.exports = app;
