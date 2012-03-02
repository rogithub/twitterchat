var mongoose 	= require('mongoose'),
    util	= require('util'),
    Schema	= mongoose.Schema;

var UserSchema = new Schema({
	 twitterId       : {type: Number, index: true},
         timeZone        : {type: String},
         name            : {type: String},
         twitterIdStr    : {type: String},
         protected       : {type: Boolean},
         location        : {type: String},
         screenName      : {type: String},
         profileImageUrl : {type: String}
});

UserSchema.statics.findByTwitterId = function(twitterId, callback){
	return this.find({'twitterId': twitterId}, callback);
};

var db = mongoose.connect('mongodb://localhost/twitterchat');
mongoose.model('User', UserSchema);

exports.findOrCreateByTwitterData = function(twitterUserData, accessToken, accessTokenSecret, promise, callback) {
		
	var User = mongoose.model('User');
	var user;
 	
	User.findByTwitterId(twitterUserData.id, function (err, docs){				
		
		if(err) {					
			console.log('Err: ' + err);
			promise.fail(err);
			callback(err, undefined);
			return;
		}
	
		if (docs.length > 0) {
			user = docs[0];		
			console.log('Users: ' + util.inspect(docs));
			promise.fulfill(user);
			mongoose.disconnect();
			callback(undefined, user);
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
					console.log('Err: '+ err);
					promise.fail(err);
					mongoose.disconnect();
					callback(err, undefined);
					return;
				}
				console.log('User created');
			});			
		}
	});	
};
