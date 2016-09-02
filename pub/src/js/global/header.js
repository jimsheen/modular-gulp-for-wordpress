var App = App || {};

App.header = {

    init: function() {
        this.events();
    },

    toggleLogos: function() {
        var $win = $(window),
            $logoContent = $('.kihe-logo-content').eq(0);

        if ($win.scrollTop() > $('.kihe-college-banner-content').eq(0).height()) {
            $logoContent.addClass('small-logo');
        } else {
            $logoContent.removeClass('small-logo');
        }
    },

    closeDrilldown: function(drilldown, drilldownSub) {
        drilldownSub.removeClass('is-active');
        drilldown.removeClass('expanded');
    },

    events: function() {

        var $win = $(window);
        var $langMenu = $('.kihe-languages-menu');
        var $menuToggle = $('#menu-toggle');
        var $menuIcon = $menuToggle.find('span');
        var $searchPanel = $('.kihe-search-panel-desktop');
        var $drilldownMenu = $('.is-drilldown');
        var $drilldownSub = $('.kihe-drilldown-submenu');




        /** Langauges menu */
        $langMenu.on('click', function() {
            // Open languages menu
            $(this).toggleClass('dropped-down');

            // Close drilldown menu and search panel
            App.header.closeDrilldown($drilldownMenu, $drilldownSub);
            $('.is-drilldown, .kihe-search-panel-desktop').removeClass('expanded');

            // Toggle menu icons
            $menuIcon.addClass('kihe-menu').removeClass('kihe-close');
        });
        // Close languages menu when cursor leaves menu
        $langMenu.on('mouseout', function() {
            if (!$langMenu.eq(0).is(':hover') && !$langMenu.eq(0).find('ul').is(':hover')) {
                $(this).removeClass('dropped-down');
            }
        });




        /** Search panel toogle */
        $('.kihe-search-toggle').on('click', function() {
            // Close drilldown menu
            App.header.closeDrilldown($drilldownMenu, $drilldownSub);

            // Toggle menu icons
            $menuIcon.toggleClass('kihe-menu kihe-close');

            // Open search panel
            $searchPanel.addClass('expanded');
        });
        // Close search panel on 'close' button click
        $('.kihe-search-panel-close').on('click', function() {
            $searchPanel.removeClass('expanded');
        });




        /** Menu toggle */
        $menuToggle.on('click', function() {
            var $drilldownMenu = $('.is-drilldown');

            if ($(this).find('span').hasClass('kihe-close')) {
                // Close drilldown menu and submenu
                App.header.closeDrilldown($drilldownMenu, $drilldownSub);
            } else {
                // Open drilldown menu
                $drilldownMenu.addClass('expanded');
            }
            // Close search panel
            $searchPanel.removeClass('expanded');

            // Toggle menu icons accordingly
            $menuIcon.toggleClass('kihe-menu kihe-close');
        });




        /** Set sub menu title on link click */
        $('.top-level-link').on('click', function() {
            $('.js-drilldown-back a').html($(this).html());
        });




        /** Logo toggle */
        if ($('.single-colleges, .single-universities').length > 0) {
            $win.scroll(function() {
                App.header.toggleLogos();
            });
        }
    }
}