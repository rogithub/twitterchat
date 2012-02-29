
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'twitterchat' })
};

exports.chat = function(req, res){
  res.render('chat', {title: 'twitterchat' })
};
