$(function() {
    
    var sessionId = $("#sessionId").val();
    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    var messages = $("#msgs");

    var socket = io.connect(document.location.host + "/private/" + sessionId);

    var pageData = {
	sender: {
	   	screenName: $("#senderScreenName").val(),
    		twitterId: $("#senderTwitterId").val()
	},
	target: {
		screenName: $("#targetScreenName").val(),
                twitterId: $("#targetTwitterId").val()
	},
	sessionId: sessionId
    };

    txtMsg.focus();
   
    socket.emit('join',  pageData);
    
    socket.on('message', function(data) {	
	var strData = data.message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");	
	messages.prepend('<li class="message"><a href="http://twitter.com/' + data.sender.screenName + '">@' + data.sender.screenName + '</a>: '  + strData + '</li>');
    });

    socket.on('joined', function(data) {	
        messages.prepend('<li class="joined">@' + data.sender.screenName + ' connected.' + '</li>');
    });

    socket.on('leaved', function(data) {
	messages.prepend('<li class="joined">@' + data.sender.screenName + ' closed his window.' + '</li>');
    });

    function sendMessage() {
	var msg = txtMsg.attr('value');
	var data = {sender: pageData.sender, target: pageData.target, message: msg, sessionId: pageData.sessionId};
        if (msg) {
            socket.emit('message', data);
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
