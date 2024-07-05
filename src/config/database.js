const mongoose = require('mongoose');
const config = require('../config/config');

const dbConn = mongoose.createConnection(config.mongo_uri);

dbConn.on('connected', () => {
  console.log(`Database connection establish successfully.`);
});

dbConn.on('error', (err) => {
  console.log(`Database connection has occured error: ${err}`);
});

dbConn.on('disconnected', () => {
  console.log(`Database Connection to "${mongoUri}" is disconnected`);
});

module.exports = {
  dbConn,
  mongoose
};
