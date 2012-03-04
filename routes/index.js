
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'twitterchat' })
};

exports.chat = function(req, res){
  if (req.loggedIn) {
  	res.render('chat', {title: 'twitterchat' });
  }
  else {
	res.writeHeader(303, {'location': '/'});
	res.end();
  }
}

