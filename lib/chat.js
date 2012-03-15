// chat lirary

var message_schema 	= require('./schemas/messageSchema'),
    online_schema	= require('./schemas/onlineSchema'),
    logger      	= require('log4js').getLogger();

module.exports.listen = function(server) {
	var io = require('socket.io').listen(server);	
		
	io.sockets.on('connection', function(client) {
		
		online_schema.getAll(function(err, onlineUsers) {
			if (err) throw err;
			logger.debug("getting online users:");
			logger.debug(onlineUsers);
			client.emit("getOnlineUsers", onlineUsers);						
		}); 	

		client.on('message', function(data) {
			io.sockets.emit('message', data);
						
			message_schema.saveMessage(data);
		});
		
		client.on('join', function(data) {
			client.set('data', data, function() {
				if (!data || !data.screenName) return;
				io.sockets.emit("joined", data);
								
				online_schema.goOnline(data);
			});			
		});

		client.on('disconnect', function() {
			client.get('data', function(err, data) {
				if (err) throw err;
				if (!data || !data.screenName) return;
				io.sockets.emit("leaved", data);
				
				online_schema.goOffline(data);
			});
		});

		client.on('openPrivate', function (data) {
			io.sockets.emit('openPrivate', data);
		});
	});
};
