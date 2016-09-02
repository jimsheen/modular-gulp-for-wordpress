var App = App || {};



App.imageGallery = function(el) {


    var $container = $('.image-container'),
        $columnChildren = $('.image-container > div').children();



    var layoutFunction = function() {
        $el.find('.image-container').children().each(function(i) {

            var $childContainer = $(this);
            var $simg = $childContainer.find('.image.small'),
                $limg = $childContainer.find('.image.large'),
                swidth = $simg.outerWidth(),
                lheight = $limg.outerHeight();

            var topBottom = (i === 0) ? 'top' : 'bottom';

            $simg.css(topBottom, lheight);

            $simg.each(function(i) {
                $(this).css({
                    'left': i * swidth
                });
            });

            var isAnimating = 0;
            $childContainer.find('.image').off().on('click tap', function() {

                var $this = $(this);

                console.log($this);

                if (!$this.hasClass('large') && isAnimating === 0) {
                    isAnimating = 1;
                    var offset = $this.css('left');
                    var $limg = $childContainer.find('.image.large');
                    var sc = {};
                    var lc = {};

                    sc[topBottom] = lheight;
                    sc['left'] = offset;
                    $limg.removeClass('large').addClass('small').css(sc);

                    lc[topBottom] = '0';
                    lc['left'] = '0';
                    $(this).css(lc).removeClass('small').addClass('large');
                    setTimeout(function() {
                        isAnimating = 0;
                    }, 200);
                }; // if
            })
        })
    }

    var mobileSetup = function() {
        console.log($columnChildren);
        if ($container.find('.left').length != 0) {
            $columnChildren.unwrap();
        }
    }

    var sliderSetup = function() {
        console.log(sliderSetup);
        $container.addClass('mobile-slider');
        el.find('.image-container').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true, 
            appendDots: el.find('.slider-dots')
        })
    }

    var destroySlider = function() {
        if ($container.hasClass('mobile-slider')) {
            $container.removeClass('mobile-slider');
            el.find('.image-container').slick('unslick');
            for (var i = 0; i < $columnChildren.length; i += 4) {
                var styleClass = (i === 4) ? 'right' : 'left';
                $columnChildren.slice(i, i + 4).wrapAll("<div class='" + styleClass + "'></div>");
            }

        }
    }

    $(window).on('load resize', function() {

        var ww = $(window).width();

        if (ww >= 640) {
            destroySlider();
            layoutFunction();

        } else {
            mobileSetup();
            sliderSetup();
        }
    })

}
