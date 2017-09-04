var socket = io.connect("http://localhost");
var el = document.getElementById('server-time');

socket.on('time', function(timeString) {
    el.innerHTML = 'Server time: ' + timeString;
});