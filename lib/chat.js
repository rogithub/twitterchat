var mongoose 		= require('mongoose'),
    util     		= require('util'),
    Schema   		= mongoose.Schema,
    config   		= require('konphyg')(__dirname + '/../config')
    logger   		= require('log4js').getLogger(),
    message_schema 	= require('./schemas/messageSchema');

var twitterChatConfig = config('twitterchat');
mongoose.connect(twitterChatConfig.database.host);
var Message = message_schema.get();

module.exports.listen = function(server, user) {
	if (!user) {
		logger.debug('Err: ');		
		throw 'Not authenticated';
	}
	if (!user.screenName) {
		logger.debug('Err: ')
		throw 'Not authenticated';
	}

	var io = require('socket.io').listen(server);
	var username = '@' + user.screenName;
	logger.debug('Listening as: '+ username);
	
	io.sockets.on('connection', function(client) {
		io.sockets.emit('joined', username);
		logger.debug('joined ' + username);

		client.on('message', function(message) {
			logger.debug(username + ": " + message);
			io.sockets.emit('message', username + ': ' + message);
						
			message_schema.createMessage(user, message).save(function (err) {
				if (err) {
					logger.debug('Err: '+ err);
					throw err;
				}				
			});
		});
		
		client.on('disconnect', function() {
			logger.debug(username + " disconnected");
			io.sockets.emit("disconnect", username);
		});
	});
};
