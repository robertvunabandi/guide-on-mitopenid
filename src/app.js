'use strict';
// libraries
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');

// local dependencies
const db = require('./db');
const views = require('./routes/views');
const api = require('./routes/api');

// initialize express app
const app = express();

// set POST request body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// enable cross origin requests requests
app.use(cors());

// morgan to log requests sent to this server
// -
// every time a request is sent to this server,
// morgan logs that request with its method
// (POST or GET), the status code (e.g. 200),
// the url (e.g.: '/logout'), etc. You can see
// the documentation for this with this link:
// https://www.npmjs.com/package/morgan
app.use(morgan(':method :status :url :response-time ms :res[content-length]'));

// set routes
app.use('/', views);
app.use('/api', api);
app.use('/static', express.static('public'));

// 404 route
app.use(function (req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// route error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send({
		status: err.status,
		message: err.message,
	});
});

// port config
const port = 3000; // config variable
const server = http.Server(app);
server.listen(port, function () {
	console.log('Server running on port: ' + port);
});