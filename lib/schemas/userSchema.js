// User schema.
// ============
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    logger   = require('log4js').getLogger();

var user_schema = function () {
	var that;

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

	mongoose.model('User', UserSchema);

	function getSchema() {
		return mongoose.model('User');
	};

	function findByTwitterId(twitterId, callback) {
		getSchema().findByTwitterId(twitterId, callback);
	}

	function saveUser(twitterUserData, callback) {
		var User = getSchema();
		var user = new User();
		user.twitterId       = twitterUserData.id;
		user.timeZone        = twitterUserData.time_zone;
		user.name            = twitterUserData.name;
		user.twitterIdStr    = twitterUserData.id_str;
		user.protected       = twitterUserData.protected;
		user.location        = twitterUserData.location;
		user.screenName      = twitterUserData.screen_name;
		user.profileImageUrl = twitterUserData.profile_image_url;	
		
		user.save(function(err){
			if (err) {
				logger.debug('Err: '+ err);
				callback(err, null);
				throw err;
			}
			callback(null, user);
			logger.debug('User created');						
		});				
	}

	that = {
		findByTwitterId: findByTwitterId,
		saveUser: saveUser
	};

	return that;	
}

module.exports = user_schema();
