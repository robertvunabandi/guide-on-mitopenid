"use strict";
// required for authentication
const passport = require('passport');
const MITStrategy = require('passport-mitopenid').MITStrategy;

// load the User model since the application user gets saved
// within a function in this file
const User = require('./models/user');

// if your app is deployed, change the host with whatever host
// you have. A Heroku app host will look like:
// https://mysterious-headland-54722.herokuapp.com
const host = 'http://localhost:3000';

passport.use('mitopenid', new MITStrategy({
	clientID: 'your client id from https://oidc.mit.edu/',
	clientSecret: 'your client secret from https://oidc.mit.edu/',
	callbackURL: host + '/auth/mitopenid/callback'
}, function(accessToken, refreshToken, profile, done) {
	// uncomment the next line to see what your user object looks like
	// console.log(profile);

	// see comment at the end of file for what profile looks like
	// once we get the user's information from the request above, we need
	// to check if we have this user in our db. If not, we create this
	// user.
	User.findOne({mitid: profile.id}, function (err, user) {
		if (err) {
			return done(err);
		} else if (!user) {
			// if we don't find the user, that means this is the first
			// time this use is logging into our application, so, we
			// create this user.
			return createUser();
		} else {
			return done(null, user);
		}
	});

	// create the user using the mongoose model User
	function createUser() {
		const new_user = new User({
			name: profile.name,
			given_name: profile.given_name,
			middle_name: profile.middle_name,
			family_name: profile.family_name,
			email: profile.email,
			mitid: profile.id
		});
		new_user.save(function (err, user) {
			if (err) {
				return done(err);
			}
			return done(null, user);
		});
	}
}));


// store the user's id into the user's session. store just the id
// so that it's efficient.
// see: http://www.passportjs.org/docs/configure/
passport.serializeUser(function (user, done) {
	done(null, user._id);
});

// retrieve the id that we saved in the user's cookie session with
// serializeUser, find that user with User.findById, then finally,
// place that user inside of req.user with done(err, user)
// see: http://www.passportjs.org/docs/configure/
passport.deserializeUser(function (id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

module.exports = passport;

/*
profile looks like:
{
	id: String,
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