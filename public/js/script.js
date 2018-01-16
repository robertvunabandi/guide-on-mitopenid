'use strict';

function main() {
	get('/api/whoami', {}, function (user) {
		renderNavbar(user);
		renderPage(user);
	});
}

// run main only after the entire page has loaded:
// this is better practice to avoid not being able
// to find DOM nodes
window.addEventListener('load', function () {
	main();
});