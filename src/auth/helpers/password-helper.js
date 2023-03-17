const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword = (myPlaintextPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

exports.comparePassword = (myPlaintextPassword, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    if (err) {
      return reject(err);
    }
    resolve(result);
    });
  });
};