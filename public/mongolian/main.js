var socket = io.connect();

socket.on ('download', function(config) {
    $("#status").text("Downloading " + config.filename);
    setTimeout(function() {
        window.location.href = 'download/';
    }, 3000);
});

socket.on ('downloading', function() {
    $("#status").text("Someone is using the service!! Back off!!");
});

$("#connect").click(function() {
    $("#status").text("Connecting to Rizon #NIBL");
    var s = $("#command").val().split(" ");
    var botname = s[1];
    var packnum = s[4];
    if (packnum.charAt(0) == '#') {
        packnum = packnum.substr(1);
    }
    socket.emit ('initiate', { botname : botname, packnum : packnum});
    $("#connect").prop('disabled', true);
});