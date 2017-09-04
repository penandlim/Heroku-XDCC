var socket = io.connect();

socket.on ('download', function(config) {
    window.location.href = 'download/';
    $("#status").text("Fetching " + config.filename + "...\nPlease wait...");
});

socket.on ('wait', function(lastinfo) {
    $("#status").html("Sorry please try again a bit later!\nSomeone is downloading... \n<b>" + lastinfo.lastTitle + "</b>\nIt's currently at <b>" + lastinfo.lastPercentage + "</b>%");
});

socket.on ('usercount', function(count) {
    $("#usercount").text(count);
});

socket.on ('errormsg', function(msg) {
    $("#status").html(msg);
});

socket.on ("file_done", function(msg) {
    $("#status").html("Copy and paste the command here: ");
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
});