//user online schema
//==================
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    logger   = require('log4js').getLogger();


var online_schema = function() {
	var that;

	var OnlineSchema = new Schema({
        	twitterId       : {type: Number, index: true},
        	screenName      : {type: String, index: true},
        	date            : {type: Date}
	});

        function getSchema() {
                return mongoose.model("onlineUser");
        };

	function goOnline(data) {
        	var Online = getSchema();
 		Online.getByTwitterId(data.twitterId, function(err, usrs) {
                        if (err) {
                                logger.debug('Err: '+ err);
                                throw err;
                        }

                        if (usrs.length == 0) {
				var online = new Online();
                		online.twitterId = data.twitterId;
                		online.screenName= data.screenName;
                		online.date = Date.now();
                		online.save(function (err){
                        		if (err) {
                                		logger.debug('Err: ' + err);
                                		throw err;
                        		}
                		});
			}
		});               
	};

	function goOffline(data) {
		var Online = getSchema();	
		Online.getByTwitterId(data.twitterId, function(err, usrs){
			if (err) {
				logger.debug('Err: '+ err);
				throw err;
			}
			
			if (usrs.length > 0){
				usr = usrs[0].remove();				
			}
		});
	}

	function getAll(callback) {
		return getSchema().getAll(callback);
	}

 	OnlineSchema.statics.getAll = function(callback) {
                return this.find(null, callback);
        };

	OnlineSchema.statics.getByTwitterId = function(twitterId, callback) {                
		return this.find({'twitterId': twitterId}, callback);
        };

	mongoose.model('onlineUser', OnlineSchema);

	that = {
		getAll: getAll,
		goOnline: goOnline,
		goOffline: goOffline
	};
	
	return that;
}

module.exports = online_schema();
