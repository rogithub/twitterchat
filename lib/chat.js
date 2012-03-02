var  io 	= require('socket.io');


module.exports.listen = function(server, user) {	
	if (!user) {
		console.log("==NO USER CONNECTED");
		throw 'Not authenticated';
	}

	var socket = io.listen(server);
	var username = '@' + user.screenName;
	console.log('==LISTEN AS: '+ user.screenName);
	
	socket.on('connection', function(client) {
		socket.emit('joined', username);
		client.on('message', function(message) {
			socket.emit(username + ': ' + message);
		});
	});
}
