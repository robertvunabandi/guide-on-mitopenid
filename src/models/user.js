const mongoose = require('mongoose');

// many of the parameters for this UserSchema are the ones
// returned by MIT OpenID when the scopes are openid,
// offline_access, email, and profile. Other parameters can
// be added in case one asks for a scope number for example.
const UserSchema = new mongoose.Schema({
	name: String,
	given_name: String,
	middle_name: String,
	family_name: String,
	email: String,
	// this is the "sub" parameter returned in openid connection
	openid: String
});

module.exports = mongoose.model('User', UserSchema);