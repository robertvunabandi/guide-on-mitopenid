'use strict';

function newPageItem(text) {
	const divBlock = document.createElement('div');
	divBlock.innerHTML = text;
	return divBlock;
}

function renderPage(user) {
	const page = document.getElementById('page');
	// if user is logged in, we should see the following, but
	// since we removed authentication, that should never work
	// NOTE: This is a lowkey hack
	if (user._id) {
		page.appendChild(newPageItem("Now, you are logged in with <b style='color: darkred;'>MIT OpenID</b>. Your name is"));
		page.appendChild(newPageItem("<i style='color: navy'>" + user.name + "</i>"));
	} else {
		page.appendChild(newPageItem("You are <b style='color: darkred; text-decoration: underline;'>NOT</b> logged in"));
	}
}