var express = require('express');
var router = express.Router();
var reddit = require('../cacheReddit.js');

router.get('/', function(req, res, next) {
	// reddit.saveCache();
	res.send(JSON.stringify(reddit.cache, null, 2));
});

module.exports = router;