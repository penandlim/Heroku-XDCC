

var socket = io.connect();

socket.on ('download', function(config) {
    console.log(config);
    if (config.finished) {
        _rotSpeed = 1;
        $("#status").text("Copy and paste the command here: ");
        $(".spinner").fadeOut();
    } else {
        _rotSpeed = 3.5;
        window.location.href = 'download/';
        $("#status").text("Fetching " + config.filename + "...\nPlease wait...");
    }
});

socket.on ('wait', function(lastinfo) {
    _rotSpeed = 1;
    $("#status").html("Sorry please try again a bit later!\nSomeone is downloading... \n<b>" + lastinfo.lastTitle + "</b>\nIt's currently at <b>" + lastinfo.lastPercentage + "</b>%");
    $(".spinner").fadeOut();
});

socket.on ('usercount', function(count) {
    $("#usercount").text(count);
});

socket.on ('errormsg', function(msg) {
    _rotSpeed = 1;
    $("#status").html(msg);
    $(".spinner").fadeOut();
});

$("#connect").click(function() {
    _rotSpeed = 2;
    $(".spinner").fadeIn();
    $("#status").text("Connecting to Rizon #NIBL");
    var s = $("#command").val().split(" ");
    var botname = s[1];
    var packnum = s[4];
    if (packnum.charAt(0) == '#') {
        packnum = packnum.substr(1);
    }
    socket.emit ('initiate', { botname : botname, packnum : packnum});
});

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

/* use as handler for resize*/

$(window).resize(adjustLayout);
/* call function in ready handler*/
$(document).ready(function(){

    adjustLayout();
    $.get("https://horriblesubs.info/rss.php?res=1080", function (data) {
        var list = $("#rsswrapper");
        list.html($('<p/>').addClass("rss").text($(data).find("channel").find("description").text()));
        var unordered = $("<ul/>").addClass("left");
        var unorderedDates = $("<ul/>").addClass("right");
        var curDate = new Date();
        var pubDates = [];
        $(data).find("item").each(function () { // or "item" or whatever suits your feed
            var el = $(this);
            var pubdate = timeDifference(curDate, new Date(el.find("pubDate").text()));

            var name = el.find("title").text().substr(15);
            name = name.substr(0, name.indexOf("[1080p].mkv"));
            var title = $('<li/>').addClass("left").append($("<span/>").addClass("animetitle").text(name));
            unordered.append(title);
            unorderedDates.append($('<li/>').addClass("right").append().text(pubdate));
        });
        list.append(unordered);
        list.append(unorderedDates);
        $(".spinner").fadeOut();
        $("li.left").click(function() {
            $(".spinner").fadeIn();
                searchFor($(this).text());
            }
        );
    });
    $('#wrapper').css('visibility','visible').hide().fadeIn(1000);
    setTimeout(function(){
        $('#rsswrapper').css('visibility','visible').hide().fadeIn(1000)
    }, 500);
    setTimeout(function(){$('#quote').css('visibility','visible').hide().fadeIn(2000)}, 4000);
});

function searchFor(animeTitle) {
    $("#command").val("...");
    $.get("https://nibl.co.uk/bots.php?search=" + encodeURIComponent("[HorribleSubs] " + animeTitle + " [1080p].mkv"), function (data) {
        var results = [];
        $(data).find(".botlistitem").each(function () {
            if (!this.getAttribute("botname").includes("v6")) {
                results.push("/msg " + this.getAttribute("botname") + " xdcc send #" + this.getAttribute("botpack"));
            }
        });
        var result = results[Math.floor(Math.random()*results.length)];
        console.log(result);
        $(".spinner").fadeOut();
        $("#command").val(result);
    });
}


function adjustLayout() {

    var wheight = $(window).height();
    var wwidth = $(window).width();
    var wrapperheight = $("#wrapper").height();
    var howmuch = ( wheight * 0.55 - wrapperheight ) / 2;
    // $("#wrapper").css("transform", "translateY(" + howmuch + "px)");

    $("#rsswrapper").css("height", wrapperheight + "px");
    $('#quote').css('top', (wheight + wrapperheight - $('#quote').height()) / 2 + 100 + "px");
    $('#quote').css('right', (wwidth / 2) + 50 + "px");

}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';
    }
}