// cache reddit
var fs = require('fs');
var reddHead = require('reddit_headlines');

var cacheReddit = function () {
	var folder = 'reddit/';
	return {
		cache: {},
		loadLocal: function () {
			var parentObj = this;
			var local = fs.readdirSync('reddit');

			local.forEach(function (file) {
				parentObj.cache[file] = fs.readFileSync(folder+file, 'utf8').split('\n');
			});

			return parentObj;
		},
		loadNew: function (sub, callback) {
			var parentObj = this,
				count = 10,
				titles = [];

			var getSub = function (body) {
				if (count) {
					console.log(count);
					var after = body.data.after;
					body.data.children.forEach(function (post) {
						titles.push(post.data.title);
					});

					count--;
					reddHead.get(sub, { limit: 100, after: after }, getSub);
				}
				else {
					callback (titles);
				}
			};


			reddHead.get(sub, { limit: 100 }, getSub);
			return this;
		},
		saveCache: function () {
			var cache = this.cache;
			Object.keys(cache).forEach(function (sub) {
				fs.writeFile(folder + sub, cache[sub].join('\n'), function (err) { 
					if (err) throw err; 
					console.log(sub+' saved.'); 
				});
			});
		}
	};
}

module.exports = new cacheReddit();