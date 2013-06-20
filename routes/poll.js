// perform polling to guildpower.net

var request = require('request'),
	fs = require('fs');

var guild_api = 'http://guildpower.net/api/guilds',
	power_api = 'http://guildpower.net/api/all';

exports.start = function() {
	getGuilds();
	getPower();
};

// fetch and cache guilds
function getGuilds() {
	request.get(guild_api, function(err, res, body) {
		fs.writeFile('cache/guild', body, function(writeError) {
			if (writeError) {
				console.log(writeError);
			}
			setTimeout(getGuilds, 1000 * 60 * 60);	// 1hr
		});
	});
}

// fetch and cache guild stats
function getPower() {
	request.get(power_api, function(err, res, body) {
		fs.writeFile('cache/power', body, function(writeError) {
			if (writeError) {
				console.log(writeError);
			}
			setTimeout(getPower, 1000 * 60 * 60);	// 1hr
		});
	});
}