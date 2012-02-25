$(function(){
    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    txtMsg.focus();
    
    txtMsg.keypress(function(event) {
        if (event.keyCode != 13) return;
            var msg = $(this).attr('value');
        if (msg) {
            $('#messages ul').prepend('<li>' + msg + '</li>');     
        }
        txtMsg.focus();
        txtMsg.attr('value', '');
    });
    
    btnSend.click(function (){
        var msg = txtMsg.attr('value');
        if (msg) {
            $('#messages ul').prepend('<li>' + msg + '</li>');     
        }
        txtMsg.focus();
        txtMsg.attr('value', '');
    });
});