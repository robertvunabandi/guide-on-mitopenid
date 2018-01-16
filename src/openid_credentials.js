module.exports = {
	client: {
		id: 'you client id from https://oidc.mit.edu/',
		secret: 'your client secret from https://oidc.mit.edu/'
	},
	auth: {
		tokenHost: 'https://oidc.mit.edu/',
		tokenPath: '/token',
		authorizePath: '/authorize'
	}
};
