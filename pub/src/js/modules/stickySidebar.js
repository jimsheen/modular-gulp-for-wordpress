App.stickySidebar = function(el) {
    var sticky = new Waypoint.Sticky({
        element: $('.sticky-sidebar')[0],
        handler: function() {
            var sw = $('.kihe-sidebar').width();
            el.find('div').css('width', sw + 'px');
        },
        offset: 145
    });
    $('.kihe-college-content').children('span').each(function(index) {

        var target = $(this).attr('name');


        anchorLink = new Waypoint({
            element: $(this)[0],
            handler: function() {
                $('.anchors-block a').removeClass('active');
                $('.anchors-block').find('a[href="#' + target + '"]').addClass('active');
            },
            offset: 90
        })
    })
    $('a[href*="#"]:not([href="#"])').click(function() {
        var $this = $(this);
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 150
                }, 400, function() {
                    $('.anchors-block a').removeClass('active');
                    $this.addClass('active');
                });
                return false;
            }
        }
    });
}
