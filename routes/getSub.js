var express = require('express');
var router = express.Router();
var reddit = require('../cacheReddit.js');
var cache = reddit.cache;

router.post('/', function(req, res, next) {
	var sub = req.body.sub;
	if (sub) {
		reddit.loadNew(sub, function (titles) {
			cache[sub] = titles;
		});
		res.render('thanks', { subreddit: sub });
	}
});

module.exports = router;