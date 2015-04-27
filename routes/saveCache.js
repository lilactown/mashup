var express = require('express');
var router = express.Router();
var reddit = require('../cacheReddit.js');
var cache = reddit.cache;

router.get('/', function(req, res, next) {
	reddit.saveCache();
	res.send('Cache is being saved.');
});

module.exports = router;