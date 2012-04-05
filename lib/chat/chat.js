// chat lirary

var message_schema 		= require('./../schemas/messageSchema'),
    online_schema		= require('./../schemas/onlineSchema'),
    private_message_schema	= require('./../schemas/privateMessageSchema'),
    logger      		= require('log4js').getLogger(),
    uuid			= require('node-uuid'),
    config			= require('./../app/config');

module.exports.listen = function(server) {
	var io = require('socket.io').listen(server);
	var chat = io.of('/chat');
	
	chat.on('connection', function(client) {
		
		online_schema.getAll(function(err, onlineUsers) {
			if (err) throw err;
			logger.debug("getting online users:");
			logger.debug(onlineUsers);
			chat.emit("getOnlineUsers", onlineUsers);
		}); 	

		client.on('message', function(data) {
			chat.emit('message', data);
						
			message_schema.saveMessage(data);
		});
		
		client.on('join', function(data) {
			client.set('data', data, function() {
				if (!data || !data.screenName) return;
				chat.emit("joined", data);
								
				online_schema.goOnline(data);
			});			
		});

		client.on('disconnect', function() {
			client.get('data', function(err, data) {
				if (err) throw err;
				if (!data || !data.screenName) return;
				chat.emit("leaved", data);
				
				online_schema.goOffline(data);
			});
		});

		client.on('openPrivate', function (data) {			
			var privateSessionId = uuid.v4();
			chat.emit('openPrivate', { sender: data.sender, target: data.target, id:privateSessionId });
		
			var private = io.of('/private/'+privateSessionId);

                	private.on('connection', function(client) {
                		client.on('message', function(data) {
                			private.emit('message', data);
                			private_message_schema.saveMessage(data);
                        	});

                        	client.on('join', function(data) {
                        		client.set('data', data, function() {
                                		if (!data || !data.sender.screenName) return;
                                       		private.emit("joined", data);
                                	});
                        	});

                        	client.on('disconnect', function() {
                        		client.get('data', function(err, data) {
                                		if (err) throw err;
                                        	if (!data || !data.sender.screenName) return;
                                        		private.emit("leaved", data);
                                	});
                        	});		
			});
		});	
	});
};
