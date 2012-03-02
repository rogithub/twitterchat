var  io 	= require('socket.io');


module.exports.listen = function(server, user) {	
	if (!user) {
		console.log('Err: ');		
		throw 'Not authenticated';
	}

	var sockets = io.listen(server);
	var username = '@' + user.screenName;
	console.log('Listening as: '+ username);
	
	sockets.on('connection', function(client) {
		io.sockets.emit('joined', username);
		console.log('joined ' + username);

		client.on('message', function(message) {
			console.log(username + ": " + message);
			io.sockets.emit('message', username + ': ' + message);
		});
		client.on('disconnect', function() {
			console.log(username + "disconnected");
			io.sockets.emit("message", username + 'disconnected');
		});
	});
}
