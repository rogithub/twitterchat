
var message_schema 	= require('./schemas/messageSchema'),
    logger      	= require('log4js').getLogger();

var Message = message_schema.get();

module.exports.listen = function(server) {
	var io = require('socket.io').listen(server);	
		
	io.sockets.on('connection', function(client) {
		client.on('message', function(data) {
			io.sockets.emit('message', data);
						
			message_schema.createMessage(data).save(function (err) {
				if (err) {
					logger.debug('Err: '+ err);
					throw err;
				}				
			});
		});
		
		client.on('joined', function(data) {
			io.sockets.emit("joined", data);
		});

		client.on('disconnected', function(data) {
			io.sockets.emit("disconnected", data);
		});
	});
};
