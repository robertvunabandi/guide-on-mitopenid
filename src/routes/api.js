'use strict';
// dependencies
const express = require('express');
const router = express.Router();

router.get('/whoami', function (req, res) {
	// TO IMPLEMENT: send an empty object for now
	res.send({});
});

module.exports = router;