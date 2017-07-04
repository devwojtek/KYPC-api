var promise = require('bluebird');
var config = rootRequire('./config');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(config.postgre_connection);

module.exports = {
  db : db
};

