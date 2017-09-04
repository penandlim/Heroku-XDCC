var irc = require('irc'),
    sxdcc = require('sxdcc'),
    fs = require('fs'),
    ProgressBar = require('progress');



var connectIRC = function (bot, pack) {
    var user = 'desu' + Math.random().toString(36).substr(7, 3);

    var start = 0;

    console.log('Connecting...');

    var client = new irc.Client('irc.rizon.net', user, {
        channels: ['#nibl'],
        userName: user,
        realName: user
    })
        .on('join', function (channel, nick, message) {

            if (nick !== user) return;
            console.log('Joined', channel);

            var progress,
                last = 0;

            sxdcc(client, bot, pack, start, function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }
                conn.on('connect', function (meta) {
                    console.log('Connected: ' + meta.ip + ':' + meta.port);
                    progress = new ProgressBar('Downloading... [:bar] :percent, :etas remaining', {
                        incomplete: ' ',
                        total: meta.filesize,
                        width: 20
                    });
                    this.pipe(fs.createWriteStream(meta.filename));
                })

                    .on('progress', function (received) {
                        progress.tick(received - last);
                        last = received;
                    })

                    .on('error', function (err) {
                        console.log('XDCC ERROR: ' + JSON.stringify(err));
                    });
            });
        })

        .on('error', function (err) {
            console.log("IRC ERROR: " + JSON.stringify(err));
        })

        .on('notice', function (from, to, message) {
            if (to == user && from == bot) {
                console.log("[notice]", message);
            }
        });
};

module.exports.connectIRC = connectIRC;