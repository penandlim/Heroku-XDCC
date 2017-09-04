var socket = io.connect();
var el = document.getElementById('server-time');

socket.on('time', function(timeString) {
    el.innerHTML = 'Server time: ' + timeString;
});

$("#connect").click(function() {
    $("#status").append("connecting...");
    socket.emit ('initiate', { botname : $("#botname").val(), packnum : $("#packnum").val()});
    $("#connect").prop('disabled', true);
});