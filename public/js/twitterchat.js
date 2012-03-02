$(function(){
    var socket = new io.Socket('localhost', {port: 3000});
    socket.connect();

    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    var messages = $('#message ul');
    txtMsg.focus();
    
    socket.on('message', function(){
	var data = message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	messages.prepend('<li>' + data + '</li>');
    });


    function sendMessage(){
	var msg = txtMsg.attr('value');
        if (msg) {
            socket.emit(msg);
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
