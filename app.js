// switch between development and production like this:
// NODE_ENV=development node app.js
// OR
// NODE_ENV=production node app.js

var express   	= require('express')
  , routes 	= require('./routes')
  , everyauth 	= require('everyauth')
  , util 	= require('util')
  , config	= require('./lib/app/config')
  , users 	= require('./lib/chat/users')
  , chat	= require('./lib/chat/chat')
  , logger 	= require('log4js').getLogger()
  , mongoose	= require('mongoose');

var app = express.createServer();

mongoose.connect(config.appConfig.database.host);

everyauth.twitter
	.consumerKey(config.appConfig.authentication.key)
	.consumerSecret(config.appConfig.authentication.secret)
	.findOrCreateUser(function(session, accessToken, accessTokenSecret,twitterUserData) {
		var promise = this.Promise();
		logger.debug('getting promise reference');

		users.findOrCreateByTwitterData(twitterUserData, function (err, user) {		
			if (err) {
				logger.debug('promise fail');
				logger.debug('Err: ' + err);
				promise.fail(err);
				throw err;
			}
			
			logger.debug('promise set');
			promise.fulfill(user);			
		});
		
		logger.debug('returning promise');
		return promise;
	}).redirectPath('/chat');

// Configuration
var MemStore = express.session.MemoryStore;
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: config.appConfig.application.secret}));
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
app.get('/private', routes.private);

chat.listen(app);
app.listen(config.appConfig.application.port);
logger.debug("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
logger.debug(config.getUrl());
