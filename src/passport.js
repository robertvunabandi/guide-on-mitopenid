"use strict";
// required for authentication
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');

// load models
const User = require('./models/user');

// load your client credentials, which are provided by MIT OpenID
const oauth_credentials = require('./openid_credentials.js');

// if your app is deployed, change the host with whatever host
// you have. A Heroku app host will look like:
// https://mysterious-headland-54722.herokuapp.com/
const host = 'http://localhost:3000';

// create the passport Oauth2.0 parameters
const passport_parameter = {
	authorizationURL: 'https://oidc.mit.edu/authorize',
	tokenURL: 'https://oidc.mit.edu/token',
	clientID: oauth_credentials.client.id,
	clientSecret: oauth_credentials.client.secret,
	callbackURL: host + '/auth/oidc/callback'
};

passport.use('oidc', new OAuth2Strategy(passport_parameter, function (accessToken, refreshToken, profile, done) {

	getUserInformation();

	function getUserInformation() {
		// make a request to openid to get the information about this user,
		// which we're able to get because we have the accessToken (like a
		// key) that oidc.mit.edu needs in order to provide us with the
		// requested information
		request(buildUserInfoRequestParameter(accessToken), function (error, response, body) {
			if (!error && response.statusCode === 200) {
				// uncomment the next line to see what your user object looks like
				// console.log(JSON.parse(body))
				return findOrCreateUser(JSON.parse(body));
			} else {
				return done(new Error('An error occurred while making the access request'));
			}
		});
	}

	function buildUserInfoRequestParameter(accessToken) {
		return {
			url: 'https://oidc.mit.edu/userinfo',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			}
		};
	}

	// see comment at the end of file for what userInformation looks like
	// once we get the user's information from the request above, we need
	// to check if we have this user in our db. If not, we create this
	// user.
	function findOrCreateUser(userInformation) {
		User.findOne({openid: userInformation.sub}, function (err, user) {
			if (err) {
				return done(err);
			} else if (!user) {
				return createUser(userInformation);
			}
			return done(err, user);
		});
	}

	// simply create the user using the mongoose model User
	function createUser(userInformation) {
		const new_user = new User({
			name: userInformation.name,
			given_name: userInformation.given_name,
			middle_name: userInformation.middle_name,
			family_name: userInformation.family_name,
			email: userInformation.email,
			openid: userInformation.sub
		});
		new_user.save(function (err, user) {
			if (err) {
				return done(err);
			}
			return done(err, user);
		});
	}
}));

// this basically means passport is saving the user in a memory
// efficient manner
passport.serializeUser(function (user, done) {
	done(null, user);
});

// when we need that user that passport saved above, this method
// simply returns that user that it had saved
passport.deserializeUser(function (user, done) {
	done(null, user);
});

module.exports = passport;

/*
user_info (which is JSON.parse(body)) looks like:
{
	sub: String [this seems to be the user's id],
	name: String,
	preferred_username: String [Kerberos],
	given_name: String [First name],
	family_name: String,
	middle_name: String,
	email: String [the user's email],
	email_verified: Boolean [Not sure what this is]
}

That is, if the scopes (which are set on the client registration of
MIT OpenID) are openid, offline_access, email, profile. offline_access
is basically refreshToken, which are unlimited refreshing unless the
user decides to revoke the app.
*/