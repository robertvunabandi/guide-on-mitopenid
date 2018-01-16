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
const passport = require('./passport');
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
app.use(morgan(':method :status :url :response-time ms :res[content-length]'));

// set up sessions
app.use(session({
	secret: 'session-secret', // <- make sure to make this a more secure secret
	resave: 'false',
	saveUninitialized: 'true'
}));

// hook up passport
app.use(passport.initialize());
app.use(passport.session());

// set routes
app.use('/', views);
app.use('/api', api);
app.use('/static', express.static('public'));

// authentication routes
// first route to make the authorization request and get the accessToken
// the accessToken is a key that allows us to retrieve the requested
// information from the server
app.get('/auth/oidc', passport.authenticate('oidc'));
// in the callback, we actually check if the user is logged in. If the
// user is or is not, we take the appropriate action. usually,
// failureRedirect is '/login', but we just send back to the home page
app.get('/auth/oidc/callback', passport.authenticate('oidc', {
	successRedirect: '/',
	failureRedirect: '/'
}));

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