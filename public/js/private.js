$(function() {
    var socket = io.connect(document.location.host + "/private");
    
    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    var messages = $("#msgs");

    var pageData = {
	sender: {
	   	screenName: $("#senderScreenName").val(),
    		twitterId: $("#senderTwitterId").val()
	},
	target: {
		screenName: $("#targetScreenName").val(),
                twitterId: $("#targetTwitterId").val()
	}
    };

    txtMsg.focus();
   
    socket.emit('join',  {sender: pageData.sender, target: pageData.target} );
    
    socket.on('message', function(data) {
	var strData = data.message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");	
	messages.prepend('<li class="message"><a href="http://twitter.com/' + data.sender.screenName + '">@' + data.sender.screenName + '</a>: '  + strData + '</li>');
    });

    socket.on('joined', function(data) {
        messages.prepend('<li class="joined">@' + data.sender.screenName + ' joined.' + '</li>');
    });

    socket.on('leaved', function(data) {
	messages.prepend('<li class="joined">@' + data.sender.screenName + ' disconnected.' + '</li>');
    });

    function sendMessage() {
	var msg = txtMsg.attr('value');
        if (msg) {
            socket.emit('message', {sender: pageData.sender, target: pageData.target, message: msg});
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
