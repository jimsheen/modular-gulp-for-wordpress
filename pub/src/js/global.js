/* Custom JS */

var App = App || {};

(function($) {

    // Use this variable to set up the common and page specific functions. If you
    // rename this variable, you will also need to rename the namespace below.
    var Roots = {
        // All pages
        common: {
            init: function() {
                $('body').addClass('loaded');
                App.header.init();
                App.footer();

                $(document).foundation();

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
        },
        study_options_module: {
            init: function(el) {
                App.studyOptions();
            }
        },
        our_people_module: {
            init: function(el) {
                App.ourPeople.init();
            }
        },
        popular_slider: {
            init: function(el) {
                options = {
                    desktopCols: 3,
                    tabletCols: 2,
                    mobileCols: 1
                }
                App.slider(el, options);
            }
        },
        post_slider: {
            init: function(el) {
                options = {
                    desktopCols: 4,
                    tabletCols: 3,
                    mobileCols: 1
                }
                App.slider(el, options);
            }
        },
        social_slider_blog: {
            init: function(el) {
                options = {
                    desktopCols: 4,
                    tabletCols: 2,
                    mobileCols: 1,
                    variableWidth: true
                }
                App.slider(el, options);
            }
        },
        sticky_sidebar: {
            init: function(el) {
                App.stickySidebar(el);
            }
        },
        testimonials_slider_module: {
            init: function(el) {
                App.testimonialsSlider(el);
            }
        },
        full_width_video: {
            init: function(el) {
                App.fullVideo(el);
            }
        },
        video_gallery: {
            init: function(el) {
                App.videoGallery(el);
            }
        },
        our_people_content: {
            init: function(el) {
                App.ourPeople.init();
                App.ourPeopleSlider(el);
            }
        },
        image_gallery: {
            init: function(el) {
                App.imageGallery(el);
            }
        },
        fake_twitter_blocks: {
            init: function(el) {
                App.fakeTwitterSlider(el);
            }
        }
    };

    // The routing fires all common scripts, followed by the module specific scripts.

    var UTIL = {
        fire: function(func, funcname, args) {
            var namespace = Roots;
            funcname = (funcname === undefined) ? 'init' : funcname;
            if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
                namespace[func][funcname](args);
            }
        },
        loadEvents: function() {

            UTIL.fire('common');

            for (var m in Roots) {
                el = m.replace(/_/g, '-');
                $el = $('.' + el);
                if ($el.length) {
                    UTIL.fire(m, 'init', $el);
                }
            }
        },

    };

    $(document).ready(UTIL.loadEvents);

    // $(window).resize(UTIL.resizeEvents);

})(jQuery); // Fully reference jQuery after this point.
