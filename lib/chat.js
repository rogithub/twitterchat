var mongoose = require('mongoose'),
    util     = require('util'),
    Schema   = mongoose.Schema;

var MessageSchema = new Schema({
	twitterId	: {type: Number, index: true},
	screenName	: {type: String, index: true},
	message		: {type: String},
	date		: {type: Date}
});
mongoose.model('Message', MessageSchema);
var Message = mongoose.model("Message");

function createMessage(user, strMessage) {
	var message = new Message();
	message.twitterId = user.twitterId;
	message.screenName= user.screenName;
	message.message = strMessage;
	message.date = Date.now();
	return message;
};

module.exports.listen = function(server, user) {	
	if (!user) {
		console.log('Err: ');		
		throw 'Not authenticated';
	}

	var io = require('socket.io').listen(server);
	var username = '@' + user.screenName;
	console.log('Listening as: '+ username);
	
	io.sockets.on('connection', function(client) {
		io.sockets.emit('joined', username);
		console.log('joined ' + username);
		mongoose.connect('mongodb://localhost/twitterchat');

		client.on('message', function(message) {
			console.log(username + ": " + message);
			io.sockets.emit('message', username + ': ' + message);
			
			
			createMessage(user, message).save(function (err) {
				if (err) {
					console.log('Err: '+ err);
					throw err;
				}				
			});
		});
		
		client.on('disconnect', function() {
			console.log(username + "disconnected");
			io.sockets.emit("disconnect", username);
			mongoose.disconnect();
		});
	});
}
