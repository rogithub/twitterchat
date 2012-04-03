var util	= require('util'),
    logger	= require('log4js').getLogger(),
    user_schema = require('./../schemas/userSchema');

exports.findOrCreateByTwitterData = function(profile, callback) {	 	
        var twitterUserData = profile._json;

	logger.debug('looking for user: @'+ twitterUserData.screen_name + " - twitter id: " + twitterUserData.id);

	user_schema.findByTwitterId(twitterUserData.id, function (err, docs) {
		if(err) {
			logger.debug('Err: ' + err);
			callback(err, null);
			throw err;
		}
	
		if (docs.length > 0) {
			var user = docs[0];
			logger.debug('Users: ' + util.inspect(docs));
			callback(null, user);
		}
		else {	
			user_schema.saveUser(twitterUserData, function (err, user){
				if (err) {
					logger.debug('Err: ' + err);					
					callback(err, null);
					throw err;
				}
				callback(null, user);
			});			
		}
	});
};
