var App = App || {};


App.ourPeopleSlider = function(el) {
    
    console.log(el);

    ourPeopleSliderSetup = function(el) {
        el.find('.slider').slick({
            infinite: false,
            slidesToShow: 3,
            arrows:false,
            dots: true,
            appendDots: el.find('.slider-dots'),
            responsive: [{
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            }]
        });
    }

    if (el.length > 1) {
        $.each(el, function(i) {
            ourPeopleSliderSetup(el.eq(i));
        })
    } else {
        ourPeopleSliderSetup(el); 
    }
}
