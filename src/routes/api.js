'use strict';
// dependencies
const express = require('express');
const router = express.Router();

router.get('/whoami', function (req, res) {
	res.send(req.isAuthenticated() ? req.user : {});
});

module.exports = router;