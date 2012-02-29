/**
 * Module dependencies.
 */

var express   	= require('express')
  , routes 	= require('./routes')
  , everyauth 	= require('everyauth')
  , Promise 	= everyauth.Promise
  , util 	= require('util')
  , config 	= require('konphyg')(__dirname + '/config');

var twitterConfig = config('twitterapp');

everyauth.twitter.consumerKey(twitterConfig.key).consumerSecret(twitterConfig.secret).findOrCreateUser(function(session, accessToken, accessTockenSecret,twiiterUserData){	
	var promise = new Promise();
	//users.findOrCreateByTwitterData(twitterUserData, accessTocken, accessTockenSecret, promise);
	return promise;
}).redirectPath('/chat');

var app = express.createServer();

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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
