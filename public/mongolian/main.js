
var WebTorrent = require('webtorrent');

var client = new WebTorrent();
var magnetURI = 'magnet:?xt=urn:btih:S5PAMK7R4OVV44ONTGS4VL5IHHFS6RYH&tr=http%3A%2F%2Fanidex.moe%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=http%3A%2F%2Fizetta.encore.pw%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.minglong.org%3A8080%2Fannounce';

(function() {
    client.add(magnetURI, function (torrent) {
        // Got torrent metadata!
        console.log('Client is downloading:', torrent.infoHash)

        torrent.files.forEach(function (file) {
            // Display the file by appending it to the DOM. Supports video, audio, images, and
            // more. Specify a container element (CSS selector or reference to DOM node).
            file.appendTo('body')
        })
    })
})();