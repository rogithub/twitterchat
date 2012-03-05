/*   GET home page.   */

exports.index = function(req, res){
  res.render('index', { title: 'twitterchat' })
};

exports.chat = function(req, res){
  if (req.loggedIn) {	
	//console.log(req.session.auth.twitter.user);
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

