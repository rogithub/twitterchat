// chat lirary

var message_schema 	= require('./schemas/messageSchema'),
    online_schema	= require('./schemas/onlineSchema'),
    logger      	= require('log4js').getLogger();

module.exports.listen = function(server) {
	var io = require('socket.io').listen(server);	
		
	io.sockets.on('connection', function(client) {
 		//client.emit("getOnlineUsers", online_schema.getAll());

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
	});
};
