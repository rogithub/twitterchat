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

	that = {
		get: getSchema
	};

	return that;	
}

module.exports = user_schema();
