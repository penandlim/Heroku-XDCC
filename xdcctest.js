var irc = require('xdcc').irc;
var ProgressBar = require('progress');
var progress;


var connectIRC = function (bot, pack) {
    var user = 'desu' + Math.random().toString(36).substr(7, 3);

    var start = 0;

    console.log('Connecting...');

    var client = new irc.Client('irc.rizon.net', user, {
        channels: ['#nibl'],
        userName: user,
        realName: user
    });

    client.on('join', function(channel, nick, message) {
        if (nick !== user) return;
        console.log('Joined', channel);
        client.getXdcc(bot, 'xdcc send #' + pack, '.');
    });

    client.on('xdcc-connect', function(meta) {
        console.log('Connected: ' + meta.ip + ':' + meta.port);
        progress = new ProgressBar('Downloading... [:bar] :percent, :etas remaining', {
            incomplete: ' ',
            total: meta.length,
            width: 20
        });
    });

    var last = 0;
    client.on('xdcc-data', function(received) {
        progress.tick(received - last);
        last = received;
    });

    client.on('xdcc-end', function(received) {
        console.log('Download completed');
    });

    client.on('notice', function(from, to, message) {
        if (to == user && from == bot) {
            console.log("[notice]", message);
        }
    });

    client.on('error', function(message) {
        console.error(message);
    });
};

module.exports.connectIRC = connectIRC;