//messages schema
//===============
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    logger   = require('log4js').getLogger();


var message_schema = function() {
	var that; 

	var MessageSchema = new Schema({
        	twitterId       : {type: Number, index: true},
        	screenName      : {type: String, index: true},
        	message         : {type: String},
        	date            : {type: Date}
	});

        function getSchema() {
                return mongoose.model("Message");
        };

	function createMessage (data) {
        	var Message = getSchema();
        	var message = new Message();
        	message.twitterId = data.twitterId;
        	message.screenName= data.screenName;
        	message.message = data.message;
        	message.date = Date.now();
        	return message;
	};	

	mongoose.model('Message', MessageSchema);

	that = {
		get: getSchema,
		createMessage: createMessage
	};
	
	return that;
}

module.exports = message_schema();
