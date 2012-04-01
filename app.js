// switch between development and production like this:
// NODE_ENV=development node app.js
// OR
// NODE_ENV=production node app.js

var express   	= require('express')
  , routes 	= require('./routes')
  , passport 	= require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , util 	= require('util')
  , config	= require('./lib/app/config')
  , users 	= require('./lib/chat/users')
  , chat	= require('./lib/chat/chat')
  , logger 	= require('log4js').getLogger()
  , mongoose	= require('mongoose')
  , cluster	= require('cluster') 
  , numCPUs = 	require('os').cpus().length;

var app = express.createServer();

mongoose.connect(config.appConfig.database.host);


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitter profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  logger.debug('serializing');  
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  logger.debug('deserializing');  
  done(null, obj);
});

//   Use the TwitterStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Twitter profile), and
//   invoke a callback with a user object.
passport.use(new TwitterStrategy({
    consumerKey:    config.appConfig.authentication.key,
    consumerSecret: config.appConfig.authentication.secret,
    callbackURL: config.getUrl() + "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    logger.debug('passport getting token');
    logger.debug(profile);    
          
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      users.findOrCreateByTwitterData(profile, function (err, user) {         
      	  if (err) {
              logger.debug('promise fail');
              logger.debug('Err: ' + err);
              return done(err);
          }
      
          logger.debug('promise set');
          done(null, user);
     });
  })
);

// Configuration
var emStore = express.session.MemoryStore;
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: config.appConfig.application.secret}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
app.get('/contact', routes.contact);
app.get('/private/:sessionId/:id/:name', routes.private);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/chat',
                                     failureRedirect: '/fail' }));
app.get('/logout', routes.logout);

chat.listen(app);
app.listen(config.appConfig.application.port);

/*if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died. Restart...');
    cluster.fork();
  });
} else {
  // Worker processes have a http server.
  app.listen(config.appConfig.application.port);
}
*/
logger.debug("Express server listening on port %d in %s mode", config.appConfig.application.port, app.settings.env);
logger.debug(config.getUrl());
