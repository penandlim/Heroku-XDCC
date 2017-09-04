/**
 * Created by John LIm on 9/3/2017.
 */


module.exports = function (socket) {
    var module = {};

    var irc = require('irc');
    var pipedXdcc = require("piped-xdcc");
    var fs = require("fs");
    var mime = require('mime-types');

    var myInstance, myConfig;

    module.stream = function (req, res) {
        if (myInstance != null)
        {
            res.writeHead(200, {
                'Content-Type': mime.contentType(myConfig.filename),
                'Content-Disposition': 'attachment; filename="' + myConfig.filename + '"; modification-date="Wed, 12 Feb 1997 16:29:51 -0500"',
                'Content-Length' : myConfig.filesize
            });
            myInstance.pipe(res);
        }
    };

    module.connectIRC = function (bot, pack) {
        var url = 'irc.rizon.net';
        var user = 'desu' + Math.random().toString(36).substr(7, 3);


        var pipeCallback = function (message, xdccInstance) {
            var filesize = 0;
            var percentage = 0;

            if (message == null) {
                console.log("it probably went good");

                xdccInstance.on('connect', function (config) {
                    myInstance = xdccInstance;
                    myConfig = config;
                    filesize = config.filesize;
                    socket.emit("download");
                    console.log("Started downloading" + config.filename + " from " + config.ip);
                });

                xdccInstance.on('progress', function (totalReceived) {
                    let temp = Math.round((totalReceived * 100) / filesize );
                    if (temp > percentage) {
                        socket.emit("downloading", {name: config.filename, percent : temp});
                        console.log( percentage + "% " +totalReceived + " / " + filesize);
                        percentage = temp;
                    }
                });

                xdccInstance.on('complete', function (config) {
                    console.log("Downloaded " + config.filename + " from " + config.ip);
                    if (myInstance != null) {
                        myInstance.destroy();
                    }
                    myInstance = null;
                    client.disconnect();
                });

                xdccInstance.on('dlerror', function (error, config) {
                    console.log("Error");
                    console.log(error);
                    if (myInstance != null) {
                        myInstance.destroy();
                    }
                    myInstance = null;
                    client.disconnect();
                });
            } else {
                console.log(message);
                if (myInstance != null) {
                    myInstance.destroy();
                }
                myInstance = null;
                client.disconnect();
            }
        };

        console.log('Connecting to ' + url);

        var client = new irc.Client(url, user, {
            channels: ['#nibl'],
            userName: user,
            realName: user
        });

        client.on('join', function(channel, nick, message) {
            if (nick !== user) return;
            console.log('Joined ', channel);
            pipedXdcc.pipeXdccRequest(client, {botNickname: bot, packNumber: pack}, pipeCallback);
        });

        var last = 0;

        client.on('notice', function(from, to, message) {
            if (to == user && from == bot) {
                console.log("[notice]", message);
            }
        });

        client.on('error', function(message) {
            console.error(message);
        });
    };

    return module;
};