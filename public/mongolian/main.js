
// var WebTorrent = require('webtorrent');

// load irc-xdcc module
var ircXdcc = require('irc-xdcc')
// set options object
    , ircOptions = {
        userName: 'ircClient'
        , realName: 'irc Client'
        , port: 6697
        , autoRejoin: true
        , autoConnect: true
        , channels: [ '#xdcc', '#xdcc-chat' ]
        , secure: true
        , selfSigned: true
        , certExpired: true
        , stripColors: true
        , encoding: 'UTF-8'
        // xdcc specific options
        , progressInterval: 5
        , destPath: './dls'
        , resume: false
        , acceptUnpooled: true
        , closeConnectionOnDisconnect: false
    }
// used to store bot instance
    , botInstance
    ;

// construct instance using promise
ircXdcc('irc.myserver.com', 'myBotNick', ircOptions)
    .then(function(instance) {
        botInstance = instance;
        botInstance.addListener('registered', function() { console.log('bot connected'); });
    })
    .catch(console.error.bind(console));