global.userCount = 0;

var express = require('express');
var app = express();

global.lastInfo = {
    busy : false,
    lastTitle : "pending",
    lastPercentage : 0
};
global.botname = "";
global.endPipe = null;
global.allClients = [];

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/vip/', function(request, response) {
    response.render('vip/index');
});

app.get('/mongolian/', function(request, response) {
    response.render('mongolian/index');
});

// app.get('/mongolian/error/', function(request, response) {
//     response.send("Something went wrong.. please try again");
// });

var server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

global.io = require('socket.io')(server);

global.io.on('connection', (socket) => {
    var sessionid = socket.id;

    var xdcctestpipe = require('./xdcctest-pipe.js')(sessionid);
    global.userCount++;
    userCountUpdate();

    socket.on('disconnect', function () {
        global.userCount--;
        userCountUpdate();
    });
    socket.on('initiate', function (data) {
        if (global.lastInfo.busy) {
            socket.emit('wait', global.lastInfo);
        }
        else {
            global.lastInfo.busy = true;
            xdcctestpipe.connectIRC(data.botname, data.packnum);
        }
    });
    app.get('/mongolian/download/', function(req, res){
        xdcctestpipe.stream(req, res);
    });
    app.get('/mongolian/cancel/', function(req, res){
        xdcctestpipe.cancel(req, res);
    });
});

function userCountUpdate() {
    global.io.sockets.emit('usercount', global.userCount);
}

