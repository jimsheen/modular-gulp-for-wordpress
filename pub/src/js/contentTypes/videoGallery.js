var App = App || {};

App.videoGallery = function(el) {

  console.log('video gallery');
  
  // Selectors
  var videoGallerySlider = el.find('.video-gallery-slider');
  var videoGalleryNav = el.find('.video-gallery-nav')
  var videoGalleryAnchor = el.find('.video-gallery-anchor')

  // Initalize video gallery
  videoGallerySlider.slick({
    arrows: false,
    asNavFor: '.video-gallery-nav',
    fade: true,
    slidesToScroll: 1,
    slidesToShow: 1
  });

  // Initialize thumbnail navigation for gallery
  videoGalleryNav.slick({
    asNavFor: '.video-gallery-slider',
    focusOnSelect: true,
    slidesToScroll: 1,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  });

  // Load iframe on click
  videoGalleryAnchor.on('click', function(e) {
    e.preventDefault();

    var videoUrl = $(this).attr('href');
    var iframe = '<iframe class="vimeo-iframe" width="100%" height="100%" src="' + videoUrl + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';

    $(this).html(iframe);
  });

  // Destroy iframe when slide changes
  videoGallerySlider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
    var iframe = $('.vimeo-iframe');
    var playButton = '<i class="icon-play-circle"></i>';

    iframe.replaceWith(playButton);
  });
}
