var App = App || {};


App.ourPeople = {

    init: function() {
        this.events();
    },

    positionOurPeopleMenu: function() {
        var ourPeopleMenu = $('#kihe-fixed-menu-container'),
            mainMenuHeight = 70,
            ourPeopleMenuHeight = ourPeopleMenu.outerHeight(),
            adminBar = $('#wpadminbar'),
            banner = $('.kihe-banner-container'),
            win = $(window);

        if (location.hash) {
            var paddingDeduction = 0;
                
            if (win.outerWidth() < 641) {
                paddingDeduction = paddingDeduction - mainMenuHeight;
            }
            if(adminBar.length <= 0) {
                paddingDeduction = paddingDeduction + 46;
            }
            // Disbale anchor jump
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 1);
            // Set padding on body so that content starts below our people menu
            $('body').css('padding-top',
                ourPeopleMenu.outerHeight() + mainMenuHeight + adminBar.outerHeight() + paddingDeduction + 'px'
            );

        } else {
            // Show the banner and set margin top on banner so that it starts just below 
            // our people menu
            banner.show().css({
                marginTop: ourPeopleMenuHeight + 'px'
            });
        }
        // Fade in grid items
        setTimeout(function() {
            $('.our-people-grid-item').addClass('loaded');
            $('.our-people-header').addClass('loaded');
        }, 1000);
        // Fade in footer
        setTimeout(function() {
            $('.main_footer').fadeIn(600);
        }, 200);

    },

    buildPersonModal: function(trigger) {
        var ourPeopleModal = $('#kihe-our-people-modal'),
            imageSrc = $(trigger).data('src'),
            imageSrc = (imageSrc === undefined) ? $(trigger).find('.image').data('src') : imageSrc,
            title = $(trigger).find('.title').html(),
            description = $(trigger).find('.description').html(),
            longDescription = $(trigger).find('.long-description').html();

        ourPeopleModal.find('.profile-fullname').html(title);
        ourPeopleModal.find('.profile-title').html(description);
        ourPeopleModal.find('.long-description').html(longDescription);
        ourPeopleModal.find('.kihe-profile-overlay').css('background-image', 'url(' + imageSrc + ' )');
        ourPeopleModal.find('.kihe-person-image img').attr('src', imageSrc);
    },

    events: function() {
        var $win = $(window),
            $gridItem = $('.our-people-grid-item'),
            popup = new Foundation.Reveal($('#kihe-our-people-modal'));

        // When user selects option then go to link assigned to option value
        $('#kihe-our-people select').on('change', function() {
            window.location.href = this.value;
        });

        // Set the postion of the our people menu
        $win.on('load resize', function() {
            App.ourPeople.positionOurPeopleMenu();
        });

        // When a grid item is clicked
        $gridItem.on('click', function() {
            // Populate modal with data from clicked element
            App.ourPeople.buildPersonModal(this);

            // Open modal
            popup.open();
        });

        // Close modal on click
        $('.kihe-close').on('touchstart click', function() {
            popup.close();
        });


    }
}