var App = App || {};


App.fakeTwitterSlider = function(el) {

    console.log('fakeTwitterSlider');

    fakeTwitterSetup = function(el) {

        console.log(el);

        el.find('.fake-twitter-slider').slick({
            infinite: true,
            slidesToShow: 1,
            arrows: false,
            dots: true,
            customPaging: function(slider, i) {
                return '<button class="tab"></button>';
            },
        });
    }

    if (el.length > 1) {
        $.each(el, function(i) {
            fakeTwitterSetup(el.eq(i));
        })
    } else {
        fakeTwitterSetup(el);
    }
}