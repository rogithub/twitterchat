/**
 * Module dependencies.
 */

var express   	= require('express')
  , routes 	= require('./routes')
  , everyauth 	= require('everyauth')
  , util 	= require('util')
  , config 	= require('konphyg')(__dirname + '/config')
  , users 	= require('./lib/users')
  , chat	= require('./lib/chat');

var twitterConfig = config('twitterapp');
var app = express.createServer();

everyauth.twitter
	.consumerKey(twitterConfig.key)
	.consumerSecret(twitterConfig.secret)
	.findOrCreateUser(function(session, accessToken, accessTokenSecret,twitterUserData){	
		var promise = this.Promise();
		users.findOrCreateByTwitterData(twitterUserData, accessToken, accessTokenSecret, promise, function(err, usr){
			if (err) throw err;
			chat.listen(app, usr);
		});	

		return promise;
	}).redirectPath('/chat');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: "90ndsj9dfdsfro"}));
  app.use(everyauth.middleware());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  everyauth.helpExpress(app);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/chat', routes.chat);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("http://dev.twitterchat.com:%d", app.address().port);
