var App = App || {};


App.testimonialsSlider = function(el) {
    
    console.log('testimonialsSlider');

    testimonialSetup = function(el) {

        console.log(el);
        
        el.find('.slider').slick({
            infinite: true,
            slidesToShow: 1,
            appendArrows: el.find('.slider-buttons')
        });
    }

    if (el.length > 1) {
        $.each(el, function(i) {
            testimonialSetup(el.eq(i));
        })
    } else {
        testimonialSetup(el);
    }
}
