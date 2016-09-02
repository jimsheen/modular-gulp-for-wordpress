var App = App || {};


App.slider = function(el, options) {
    function setUpSlider(el) {
        el.find('.slider').slick({
            infinite: false,
            slidesToShow: options.desktopCols,
            slidesToScroll: options.desktopCols,
            appendArrows: el.find('.slider-buttons'),
            dots: true,
            appendDots: el.find('.slider-dots'),
            variableWidth: options.variableWidth,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: options.tabletCols,
                    slidesToScroll: options.tabletCols
                }
            }, {
                breakpoint: 640,
                settings: {
                    slidesToShow: options.mobileCols,
                    slidesToScroll: options.mobileCols,
                }
            }]
        });
    };

    if (el.length > 1) {
        $.each(el, function(i) {
            setUpSlider(el.eq(i));
        })
    } else {
        setUpSlider(el);
    }


}
