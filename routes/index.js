/*   GET home page.   */

exports.index = function(req, res) {
  res.render('index', { title: 'twitterchat' });
};

exports.chat = function(req, res) {
  if (req.loggedIn) {		
  	res.render('chat', { title: 'twitterchat', 
			     screenName: req.session.auth.twitter.user.screen_name,
			     twitterId:  req.session.auth.twitter.user.id
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

exports.exit = function (req, res) {

	delete req.session.auth;
	req.loggedIn = false;

//	req.logout();	
//        req.session.destroy(function(err){
//                if (err) throw err;
                res.writeHeader(303, {'location': '/'});
                res.end();
//        });
}

exports.private = function (req, res) {	
	if (req.loggedIn) {
        	res.render('private', { title: 'Private with @' + req.params.name,
			sender: {			
                             screenName: req.session.auth.twitter.user.screen_name,
                             twitterId:  req.session.auth.twitter.user.id
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
