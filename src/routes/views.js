'use strict';
// dependencies
const express = require('express');
const router = express.Router();

router.get('/', function (request, response) {
	response.sendFile(`index.html`, {root: 'src/views'});
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;