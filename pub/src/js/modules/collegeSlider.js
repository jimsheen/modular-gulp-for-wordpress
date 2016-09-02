var App = App || {};


App.collegeSlider = function(el) {
    console.log(el);
    // $target = el.find('.slider');
    // console.log($target);
    // $(document).ready(function() {
    // 	$slider = el.find('.slider');
    //     $slider.bxSlider({
    //         maxSlides: 4,
    //         minSlides: 1,
    //         slideWidth: 400
    //     });
    // });
    el.find('.slider').slick({

        // normal options...
        infinite: false,
        slidesToShow: 4,
        appendArrows: '.slider-buttons',
        // the magic
        responsive: [{

            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                infinite: true
            }

        }, {

            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                dots: true
            }

        }, {

            breakpoint: 300,
            settings: "unslick" // destroys slick

        }]
    });
}
