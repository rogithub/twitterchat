$(function(){
    //var socket = io.connect('http://localhost');
    var socket = io.connect('http://twitterchat.no.de');

    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    var messages = $("#msgs");
    var screenName = $("#screenName").val();
    var twitterId  = $("#twitterId").val();
    txtMsg.focus();
   
    socket.emit('join',  {screenName: screenName, twitterId: twitterId} );
    
    socket.on('message', function(data) {
	var strData = data.message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");	
	messages.prepend('<li class="message"><a href="http://twitter/' + data.screenName + '">@' + data.screenName + '</a>: '  + strData + '</li>');
    });

    socket.on('joined', function(data) {
        messages.prepend('<li class="joined">@' + data.screenName + ' joined.' + '</li>');
    });

    socket.on('leaved', function(data) {
	messages.prepend('<li class="joined">@' + data.screenName + ' disconnected.' + '</li>');
    });

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
