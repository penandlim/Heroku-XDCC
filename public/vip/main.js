/**
 * Created by John LIm on 9/2/2017.
 */
// function createCORSRequest(method, url) {
//     var xhr = new XMLHttpRequest();
//     if ("withCredentials" in xhr) {
//
//         // Check if the XMLHttpRequest object has a "withCredentials" property.
//         // "withCredentials" only exists on XMLHTTPRequest2 objects.
//         xhr.open(method, url, true);
//
//     } else if (typeof XDomainRequest != "undefined") {
//
//         // Otherwise, check if XDomainRequest.
//         // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
//         xhr = new XDomainRequest();
//         xhr.open(method, url);
//
//     } else {
//
//         // Otherwise, CORS is not supported by the browser.
//         xhr = null;
//
//     }
//     return xhr;
// }


var xhr = function() {
    var xhr = new XMLHttpRequest();
    return function( method, url, callback ) {
        xhr.onreadystatechange = function() {
            if ( xhr.readyState == 4 ) {
                if (xhr.status == 200) {
                    callback( xhr.responseXML );
                }
            }
        };
        xhr.open( method, url );
        xhr.send();
    };
}();

var txt = "";

var lastliclicked = -1, totalLength = 0;
var randomTrack = 0;

var stream = null;

var paused = false;
var shouldShuffle = false;

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

function processData(data) {
    var tracks = data.getElementsByTagName("track");
    // console.log(tracks);

    var mobileClassTxt = isMobile ? " class='mobile' " : "";

    txt += "<ul" + mobileClassTxt +">";
    totalLength = tracks.length;
    for (var i = 0; i < tracks.length ; i++) {
        txt += "<li id='track-" + i +"' data-index=" + i + " data-stream=" + tracks[i].children[2].textContent + mobileClassTxt + ">";
        txt += "<h3" + mobileClassTxt + ">" + tracks[i].children[0].textContent + "</h3>";
        txt += "<h2" + mobileClassTxt + ">" + tracks[i].children[1].textContent + "</h2>";
        txt += "</li>";
    }
    txt += "</div>";
    document.getElementById("list").innerHTML = txt;

    if (isMobile)
        $("#playbar").addClass("mobile");

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
            // console.log("finished");
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

    // $.ajaxPrefilter( function (options) {
    //     if (options.crossDomain && jQuery.support.cors) {
    //         var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    //         options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    //         //options.url = "http://cors.corsproxy.io/url=" + options.url;
    //     }
    // });
    //
    // $.get(
    //     url,
    //     function (response) {
    //         console.log("> ", response);
    //         processData(response)
    //     });

    xhr('get', 'http://vip.aersia.net/roster.xml?' + Math.round(Math.random() * 10000) , function(data) {
        // console.log(data);
        processData(data);
    });

});

