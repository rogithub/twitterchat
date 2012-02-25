$(function(){
    var txtMsg = $("#txtMessage");
    var btnSend = $("#btnSend");
    txtMsg.focus();
    
    txtMsg.keypress(function(event) {
        if (event.keyCode != 13) return;
            var msg = $(this).attr('value');
        if (msg) {
            $('#messages ul').append('<li>' + msg + '</li>');     
        }
        txtMsg.focus();
    });
    
    btnSend.click(function (){
        var msg = txtMsg.attr('value');
        if (msg) {
            $('#messages ul').append('<li>' + msg + '</li>');     
        }
        txtMsg.focus();
    });
});