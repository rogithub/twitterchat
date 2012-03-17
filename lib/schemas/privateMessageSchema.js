//private essages schema
//===============
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    logger   = require('log4js').getLogger();


var private_message_schema = function() {
	var that; 

	var PrivateMessageSchema = new Schema({
		sender: {

        		twitterId       : {type: Number, index: true},
        		screenName      : {type: String, index: true},
		}
		target: { 
   			twitterId       : {type: Number, index: true},
                        screenName      : {type: String, index: true},

		}

        	message         : {type: String},
        	date            : {type: Date}
	});

        function getSchema() {
                return mongoose.model("PrivateMessage");
        };

	function createMessage (data) {
        	var PrivateMessage = getSchema();
        	var message = new PrivateMessage();
        	
		message.sender.twitterId = data.sender.twitterId;
        	message.sender.screenName= data.sender.screenName;
 		
		message.target.twitterId = data.target.twitterId;
                message.target.screenName= data.target.screenName;

        	message.message = data.message;
        	message.date = Date.now();
        	return message;
	};

	function saveMessage(data) {
		createMessage(data).save(function (err) {
                	if (err) {
                        	logger.debug('Err: '+ err);
                                throw err;
                        }
                });
	}

	mongoose.model('PrivateMessage', PrivateMessageSchema);

	that = {
		saveMessage: saveMessage
	};
	
	return that;
}

module.exports = private_message_schema();
