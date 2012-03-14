// switch between development and production like this:
// NODE_ENV=development node app.js
// OR
// NODE_ENV=production node app.js

var express   	= require('express')
  , routes 	= require('./routes')
  , everyauth 	= require('everyauth')
  , util 	= require('util')
  , config 	= require('konphyg')(__dirname + '/config')
  , users 	= require('./lib/users')
  , chat	= require('./lib/chat')
  , logger 	= require('log4js').getLogger()
  , mongoose	= require('mongoose');

var twitterChatConfig = config('twitterchat');
var app = express.createServer();

mongoose.connect(twitterChatConfig.database.host);

everyauth.twitter
	.consumerKey(twitterChatConfig.authentication.key)
	.consumerSecret(twitterChatConfig.authentication.secret)
	.findOrCreateUser(function(session, accessToken, accessTokenSecret,twitterUserData){	
		var promise = this.Promise();
		users.findOrCreateByTwitterData(twitterUserData, accessToken, accessTokenSecret, promise);

		return promise;
	}).redirectPath('/chat');

// Configuration
var MemStore = express.session.MemoryStore;
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
app.get('/exit', routes.exit);
app.get('/contact', routes.contact);

chat.listen(app);
app.listen(twitterChatConfig.application.port);
logger.debug("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
logger.debug("http://%s:%d", twitterChatConfig.application.host, app.address().port);
