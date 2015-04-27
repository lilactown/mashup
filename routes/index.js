var express = require('express');
var router = express.Router();

var markov= require('markov');
var reddit = require('../cacheReddit.js').loadLocal();
var cache = reddit.cache;

// var test = reddit.loadNew('trollxchromosomes', function () {
// 	reddit.cache['trollxchromosomes'].forEach(markovChain.Build);
// });

/* GET home page. */
router.get('/', function(req, res, next) {
	var markovChain = markov.Chain(2);
	var headline = '';
	var sub1 = req.query.sub1 || 'okcupid';
	var sub2 = req.query.sub2 || 'trollxchromosomes';
	var noCache = false;
	var sublist = Object.keys(cache).map(function (el) {
		return {
			name: el,
			sub1: (el === sub1) ? 'selected' : '',
			sub2: (el === sub2) ? 'selected' : ''
		};
	});

	if (cache[sub1] && cache[sub2]) {
		reddit.cache[sub1].concat(reddit.cache[sub2]).forEach(markovChain.Build);
		headline = markovChain.Generate(50);
	}
	else {
		noCache = true;
	}

	res.render('index', {
		sublist: sublist,
		subreddit_1: sub1, 
		subreddit_2: sub2,
		headline: headline,
		noCache: noCache
	});
});

router.post('/getSub', function(req, res, next) {
	var sub = req.body.sub;
	if (sub) {
		reddit.loadNew(sub, function (titles) {
			cache[sub] = titles;
		});
		res.render('thanks', { subreddit: sub });
	}
});

router.get('/saveCache', function(req, res, next) {
	reddit.saveCache();
	res.send('Cache is being saved.');
});

router.get('/dump', function(req, res, next) {
	// reddit.saveCache();
	res.send(JSON.stringify(reddit.cache, null, 2));
});

module.exports = router;
