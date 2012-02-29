var util   = require('util');

//var c = new cradle.Connection('nodetuts26.iriscouch.com', 80, {
//  auth: { username: 'node', password: 'tuts'}
//});

//var users = c.database('users');

exports.findOrCreateByTwitterData = function(twitterUserData, accessToken, accessTokenSecret, promise) {
	console.log('LOGED');
	var user = {
		username:  'RODRIGO'
	};
	promise.fulfill(user);
	//console.log('userdata->' + util.inspect(twitterUserData));
	//console.log('accessToken->' + util.inspect(accessToken));
	//console.log('accessTokenSecret->' + util.inspect(accessTokenSecret));
	//console.log('promise->' + util.inspect(promise));
};

