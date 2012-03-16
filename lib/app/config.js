//config utils
//===============
var config 	= require('konphyg')(__dirname + '/../../config'),
    logger   	= require('log4js').getLogger(),
    util 	= require('util');

var config_utils = function() {
        var that;
	var configName = "twitterchat";
	var appConfig = config(configName);

        function getUrl() {
		var protocol =  appConfig.application.protocol;
		var host     =  appConfig.application.host;
		var port     =  appConfig.application.port;
                if (port) {
			return util.format("%s://%s:%d", protocol, host, port);
		}
		return util.format("%s://%s", protocol, host);
        };
        
        that = {
                appConfig: appConfig,
		getUrl: getUrl
        };

        return that;
}

module.exports = config_utils();

