var App = App || {};
App.fullVideo = function(el) {
    videoSetup = function(el) {
        el.find('.play-btn').on('click tap', function() {

            var $video = el.find('iframe');
            var src = $video.attr('src');

            $video.attr('src', src + '?autoplay=1');

            setTimeout(function() {
                el.addClass('video-playing');
            }, 200)
        })
    }
    if (el.length > 1) {
        $.each(el, function(i) {
            videoSetup(el.eq(i));
        })
    } else {
        videoSetup(el);
    }
}
