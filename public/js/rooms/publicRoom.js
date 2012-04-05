$(function(){
    var socket = io.connect(document.location.href);
    //var socket = new io.Socket(document.location.href, {port:80,rememerTransport:false});
    
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

    socket.on('openPrivate', function (data) {	 
	if (twitterId == data.sender.twitterId) {
		openPrivateWindow(data.target, data.id);
	}

	if (twitterId == data.target.twitterId) {
		openPrivateWindow(data.sender, data.id);
	}
    }); 

    function addUser(data) {	
        if (users.find("li input[value='"+data.twitterId+"']").length == 0) {
                var hidId = '<input type="hidden" class="twitterId" value="' + data.twitterId + '" />';
                var hidName = '<input type="hidden" class="screenName" value="' + data.screenName + '" />';
                var strLi = '<li>@' + data.screenName + hidId + hidName + '</li>';
                users.prepend(strLi);
        }
    }

    function removeUser(data) {       
        users.find("input[value='"+data.twitterId+"']").parent().remove();
    } 

    function openPrivateWindow(data, id) {
	var title = "Private chat with @" + data.twitterId;
	var url = "private/" + id + "/" + data.twitterId + "/" + data.screenName;
	window.open(url, title, null);
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

    users.delegate('li', 'click', function() {
	var hidId = $(this).find("input.twitterId").val();
	var hidName = $(this).find("input.screenName").val();	
	if (hidId != twitterId && hidName != screenName) {
		var sender = {screenName: screenName, twitterId: twitterId};
		var target = {screenName: hidName, twitterId: hidId};
		var data = {sender: sender, target: target};
		socket.emit("openPrivate", data);
	}
    });
});
