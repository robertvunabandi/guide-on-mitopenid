'use strict';
// dependencies
const express = require('express');
const router = express.Router();

router.get('/', function (request, response) {
	response.sendFile(`index.html`, {root: 'src/views'});
});

router.get('/logout', function (req, res) {
	// TO IMPLEMENT: redirect to home page for now
	res.redirect('/');
});

module.exports = router;