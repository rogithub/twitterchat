/*   GET home page.   */
var logger	= require('log4js').getLogger();


exports.index = function(req, res) {
  res.render('index', { title: 'twitterchat' });
};

exports.chat = function(req, res) {  
  logger.debug('authenticated: '+ req.isAuthenticated());      
  if (req.isAuthenticated()) {		
  	res.render('chat', { title: 'twitterchat', 
			     screenName: req.user.screenName,
			     twitterId:  req.user.twitterId
		  });
  }
  else {
	res.writeHeader(303, {'location': '/'});
	res.end();
  }
}

exports.contact = function(req, res) {
	res.render('contact', {title: 'twitterchat'});
}

exports.private = function (req, res) {	
	if (req.loggedIn) {
        	res.render('private', { title: 'Private with @' + req.params.name,
			sender: {			
                             screenName: req.user.screenName,
                             twitterId:  req.user.twitterId
			},
			target: {
			     screenName: req.params.name,
			     twitterId: req.params.id
			},
			id: req.params.sessionId
                  });
  	}
  	else {
        	res.writeHeader(303, {'location': '/'});
        	res.end();
  	}
}

exports.logout = function(req, res) {
  logger.debug('logging out');
  req.logout();
  res.redirect('/');	
}
