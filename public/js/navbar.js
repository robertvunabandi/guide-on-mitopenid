'use strict';

function newNavbarItem(text, url) {
	let itemLink = document.createElement('a');
	itemLink.className = 'nav-item nav-link';
	itemLink.innerHTML = text;
	itemLink.href = url;

	return itemLink;
}

function newNavbarItemTargetBlank(text, url) {
	let itemLink = document.createElement('a');
	itemLink.className = 'nav-item nav-link';
	itemLink.innerHTML = text;
	itemLink.href = url;
	itemLink.target = 'blank';

	return itemLink;
}

function renderNavbar(user) {
	const navbarDiv = document.getElementById('nav-item-container');
	navbarDiv.appendChild(newNavbarItem('Home', '/'));
	// NOTE: this check is a lowkey hack
	if (user._id) {
		// TO IMPLEMENT: send to home page for now
		navbarDiv.appendChild(newNavbarItem('Logout', '/'));
	} else {
		// TO IMPLEMENT: send to home page for now
		navbarDiv.appendChild(newNavbarItem('Login', '/'));
	}
	navbarDiv.appendChild(newNavbarItemTargetBlank('See Github', 'https://github.com/robertvunabandi/mitopenid'));
}
