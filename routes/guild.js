var fs = require('fs');

exports.index = function(req, res) {
	fs.stat('cache/power', function(err, stat) {
		if (err) {
			console.log(err);
		}
		var upd = stat.ctime;
		res.render('power', {title: "Guild Power Graph", lastUpdate: upd.toString()});
	});
};

exports.trend = function(req, res) {
	var guild = req.params.guild;
	
	res.render('trend', {title: "Guild Activity Trend", guild: guild});
};

exports.list = function(req, res) {
	fs.readFile('cache/guild', {encoding: 'UTF-8'}, function(err, data) {
		res.json(eval(data));
	});
};

exports.power = function(req, res) {
	fs.readFile('cache/power', {encoding: 'UTF-8'}, function(err, data) {
		res.json(eval(data));
	});
};