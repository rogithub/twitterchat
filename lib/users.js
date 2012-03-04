var mongoose 	= require('mongoose'),
    util	= require('util'),
    Schema	= mongoose.Schema,
    config	= require('konphyg')(__dirname + "/../config"),
    logger	= require('log4js').getLogger(),
    user_schema = require('./schemas/userSchema');

var twitterChatConfig = config('twitterchat');
mongoose.connect(twitterChatConfig.database.host);

exports.findOrCreateByTwitterData = function(twitterUserData, accessToken, accessTokenSecret, promise, callback) {
	logger.debug('find or create user');
	var User = user_schema.get();
	var user;
 	
	logger.debug('looking for user: @'+ twitterUserData.screenName + " - twitter id: " + twitterUserData.id);
	User.findByTwitterId(twitterUserData.id, function (err, docs) {
		
		if(err) {					
			logger.debug('Err: ' + err);
			promise.fail(err);
			callback(err, undefined);
			throw err;
		}
	
		if (docs.length > 0) {
			user = docs[0];		
			logger.debug('Users: ' + util.inspect(docs));
			promise.fulfill(user);
			callback(undefined, user);
			return;
		}
		else {			
			user = new User();
			user.twitterId	     = twitterUserData.id;
			user.timeZone	     = twitterUserData.time_zone;
			user.name	     = twitterUserData.name;
			user.twitterIdStr    = twitterUserData.id_str;
			user.protected	     = twitterUserData.protected;
			user.location	     = twitterUserData.location;
			user.screenName	     = twitterUserData.screen_name;
			user.profileImageUrl = twitterUserData.profile_image_url;
			promise.fulfill(user);
			callback(undefined, user);

			user.save(function(err){
				if (err) {
					logger.debug('Err: '+ err);
					promise.fail(err);									
					callback(err, undefined);
					throw err;
				}
				logger.debug('User created');
			});
		}
	});
};
