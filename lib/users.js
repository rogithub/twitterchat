var mongoose 	= require('mongoose'),
    util	= require('util'),
    Schema	= mongoose.Schema;

var UserSchema = new Schema({
	 twitterId       : {type: Number, index: true},
         timeZone        : {type: String},
         name            : {type: String},
         twitterIdStr    : {type: String},
         protected       : {type: Boolean},
         location        : {type: String},
         screenName      : {type: String},
         profileImageUrl : {type: String}
});

UserSchema.statics.findByTwitterId = function(twitterId, callback){
	return this.find('twitterId', twitterId, callback);
};

var db = mongoose.connect('mongodb://localhost/twitterchat');
mongoose.model('User', UserSchema);

exports.findOrCreateByTwitterData = function(twitterUserData, accessToken, accessTokenSecret, promise) {
		
	var User = mongoose.model('User');

	User.findByTwitterId(twitterUserData.id, function (err, docs){				
		console.log('===BUSCANDO USUARIO');
		if(err) {		
			console.log('===ERROR ENCONTRADO');
			console.log(err);
			promise.fail(err);
			return;
		}

		docs = docs || [];
		if (docs.length > 0) {
			console.log('===USUARIO ENCONTRADO');
			var user = docs[0];
			console.log(util.inspect(docs));						
			promise.fulfill(user);
			mongoose.disconnect();
		}
		else {			
			console.log('===CREANDO NUEVO USUARIO');
			var user = new User();
			user.twitterId	     = twitterUserData.id;
			user.timeZone	     = twitterUserData.time_zone;
			user.name	     = twitterUserData.name;
			user.twitterIdStr    = twitterUserData.id_str;
			user.protected	     = twitterUserData.protected;
			user.location	     = twitterUserData.location;
			user.screenName	     = twitterUserData.screen_name;
			user.profileImageUrl = twitterUserData.profile_image_url;
			promise.fulfill(user);
			
			user.save(function(err){
				console.log('===GUARDANDO USUARIO');
				if (err) {
					console.log(err);
					promise.fail(err);
					mongoose.disconnect();
					return;
				}
			});			
		}
	});
	console.log("===FIN DEL METODO");
};
