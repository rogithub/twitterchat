$(function(){
    var socket = undefined;
    if (document.domain)
	socket = io.connect(document.domain);
    else
    	socket = io.connect('http://localhost');

    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    var messages = $("#msgs");
    var users = $("#usrs");
    var screenName = $("#screenName").val();
    var twitterId  = $("#twitterId").val();
    txtMsg.focus();
   
    socket.emit('join',  {screenName: screenName, twitterId: twitterId} );
    
    socket.on('message', function(data) {
	var strData = data.message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");	
	messages.prepend('<li class="message"><a href="http://twitter.com/' + data.screenName + '">@' + data.screenName + '</a>: '  + strData + '</li>');
    });

    socket.on('joined', function(data) {
        messages.prepend('<li class="joined">@' + data.screenName + ' joined.' + '</li>');
	addUser(data);
    });

    socket.on('leaved', function(data) {
	messages.prepend('<li class="joined">@' + data.screenName + ' disconnected.' + '</li>');
	removeUser(data);
    });

    socket.on('getOnlineUsers', function(onlineUsers) {
	users.find("li").remove();
	if (onlineUsers) {
		for(var i=0; i < onlineUsers.length; i++) {
			addUser(onlineUsers[i]);
		}
	}
    });

    function addUser(data) {
	if (!data) return;
	if (users.find("input:hidden[value='"+data.twitterId+"']").length == 0) {
		var strHidden = '<input type="hidden" value="' + data.twitterId + '" />';
        	var strLi = '<li>@' + data.screenName + strHidden + '</li>';
        	users.preppend(strLi);
	}
    }
    
    function removeUser(data) {
 	if (!data) return;
        users.find("input:hidden[value='"+data.twitterId+"']").parent().remove();
    }

    function sendMessage() {
	var msg = txtMsg.attr('value');
        if (msg) {
            socket.emit('message', {screenName: screenName, twitterId: twitterId, message: msg});
        }
        txtMsg.focus();
        txtMsg.attr('value', '');
    };
    
    txtMsg.keypress(function(event) {
        if (event.keyCode != 13) return;
        sendMessage();
    });
    
    btnSend.click(sendMessage);
});
