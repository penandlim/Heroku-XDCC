/**
 * Created by John LIm on 9/2/2017.
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}



//
//
// var xhr = function() {
//     var xhr = new XMLHttpRequest();
//     return function( method, url, callback ) {
//         xhr.onreadystatechange = function() {
//             if ( xhr.readyState == 4 ) {
//                 if (xhr.status == 200) {
//                     callback( xhr.responseXML );
//                 }
//             }
//         };
//         xhr.open( method, url );
//         xhr.send();
//     };
// }();

var txt = "";

var lastliclicked = -1, totalLength = 0;
var randomTrack = 0;

var stream = null;

var paused = false;
var shouldShuffle = false;

function processData(data) {
    var tracks = data.getElementsByTagName("track");
    console.log(tracks);
    txt += "<ul>";
    totalLength = tracks.length;
    for (var i = 0; i < tracks.length ; i++) {
        txt += "<li id='track-" + i +"' data-index=" + i + " data-stream=" + tracks[i].children[2].textContent + ">";
        txt += "<h3>" + tracks[i].children[0].textContent + "</h3>";
        txt += "<h2>" + tracks[i].children[1].textContent + "</h2>";
        txt += "</li>";
    }
    txt += "</div>";
    document.getElementById("list").innerHTML = txt;

    $("li").on("click",function() {

        $(this).addClass("selected");
        if (lastliclicked > -1) {
            $("#track-" + lastliclicked).removeClass("selected");
        }

        var elOffset = $(this).offset().top;
        var elHeight = $(this).height();
        var windowHeight = $(window).height() - 100;
        var offset;

        if (elHeight < windowHeight) {
            offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
        }
        else {
            offset = elOffset;
        }

        $('html, body').stop();
        $('html, body').animate({
            scrollTop: offset
        }, 1000);

        // console.log($(this).attr('data-stream'));
        document.title = $(this).children()[0].textContent + " // " + $(this).children()[1].textContent;

        $("#gametitle").text($(this).children()[0].textContent);
        $("#songtitle").text($(this).children()[1].textContent);

        if (stream != null) {
            stream.stop();
            stream.unload();
            stream = null;
        }

        $("#play").removeClass("paused");

        stream = new Howl({
            src: [$(this).attr('data-stream')],
            ext: ['m4a'],
            html5: true,
            volume: $("#volumebar").val() / $("#volumebar").attr("max")
        });

        stream.play();
        $( "#seekbar" ).val(0);

        lastliclicked = $(this).attr('data-index');

        stream.on('end', function(){
            console.log("finished");
            $("#play").addClass("paused");
            var nextSong = 0;
            if (shouldShuffle) {
                nextSong = Math.round(Math.random() * (totalLength - 1));
            } else {
                if (lastliclicked < totalLength - 1) {
                    nextSong = parseInt(lastliclicked) + 1;
                }
                else {
                    nextSong = 0;
                }
            }
            $("#track-" + nextSong).trigger("click");
        });
    });

    randomTrack = Math.round(Math.random() * (totalLength - 1));
    $("#track-" + randomTrack).trigger("click");

    $( "#play" ).click(function(e) {
        if (stream != null) {
            if (paused) {
                stream.play();
                $(this).removeClass("paused");
                paused = false;
            } else {
                stream.pause();
                $(this).addClass("paused");


                paused = true;
            }
        }
    });

    $( "#skip_before" ).click(function() {
        var nextSong = 0;
        if (shouldShuffle) {
            nextSong = Math.round(Math.random() * (totalLength - 1));
        } else {
            if (lastliclicked < totalLength - 1) {
                nextSong = parseInt(lastliclicked) - 1;
            }
            else {
                nextSong = 0;
            }
        }
        console.log(nextSong);
        $("#track-" + nextSong).trigger("click");
    });

    $( "#skip_next" ).click(function() {
        var nextSong = 0;
        if (shouldShuffle) {
            nextSong = Math.round(Math.random() * (totalLength - 1));
        } else {
            if (lastliclicked < totalLength - 1) {
                nextSong = parseInt(lastliclicked) + 1;
            }
            else {
                nextSong = 0;
            }
        }
        console.log(nextSong);
        $("#track-" + nextSong).trigger("click");
    });

    $( "#shuffle" ).click(function(e) {
        if (stream != null) {
            if (shouldShuffle) {
                shouldShuffle = false;
                $(this).removeClass("enabled");
            } else {
                shouldShuffle = true;
                $(this).addClass("enabled");
            }
        }
    });

    $( "#seekbar" ).click(function(e) {
        var x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
            clickedValue = x * this.max / this.offsetWidth;

        if (stream != null) {
            // console.log(stream.duration() * clickedValue / 1000);
            stream.seek(stream.duration() * clickedValue / 1000);
            this.value = clickedValue;
        }
    });

    $( "#volumebar" ).click(function(e) {
        var x = e.pageX - $(this).offset().left, // or e.offsetX (less support, though)
            clickedValue = x * this.max / this.offsetWidth;
        $("#volume").removeClass("muteVolume");
        $("#volume").removeClass("smallVolume");
        if (clickedValue < 11) {
            clickedValue = 0;
            $("#volume").addClass("muteVolume");
        } else if (clickedValue < 50) {
            $("#volume").addClass("smallVolume");
        }
        else if (clickedValue > 90) {
            clickedValue = 100;
        }
        if (stream != null) {
            console.log(clickedValue);
            stream.volume(clickedValue / 100);
            this.value = clickedValue;
        }
    });


    window.setInterval(function(){
        if (stream && stream.duration() && !paused && stream.playing()) {
            $( "#seekbar" ).val(stream.seek() / stream.duration() * 1000);
        }
        /// call your function here
    }, 500);
}


$(function() {
    var url = 'http://vip.aersia.net/roster.xml';

    $.ajaxPrefilter( function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
            //options.url = "http://cors.corsproxy.io/url=" + options.url;
        }
    });

    $.get(
        url,
        function (response) {
            console.log("> ", response);
            processData(response)
        });

// xhr('get', 'http://vip.aersia.net/roster.xml?' + Math.round(Math.random() * 10000) , function(data) {
//
// });
});

