$(function(){
    var socket = io.connect('http://localhost');

    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    var messages = $("#msgs");
    txtMsg.focus();
    
    socket.on('message', function(data){
	var strData = data.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	messages.prepend('<li class="message">' + strData + '</li>');
    });

    socket.on('joined', function(data) {        
        messages.prepend('<li class="joined">' + data + ' joined.' + '</li>');
    });

    function sendMessage(){
	var msg = txtMsg.attr('value');
        if (msg) {
            socket.emit('message', msg);
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
