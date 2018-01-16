'use strict';
const mongoose = require('mongoose');
const mongoURL = 'your mongoURI goes here';
const options = {useMongoClient: true};

mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db connection handling
db.on('connected', () => console.log('database connected'));

module.exports = db;
