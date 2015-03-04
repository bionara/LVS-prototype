$(document).ready(function() {

    var deviceWidth = {
        'iphone': 320,
        'ipad': 767,
        'desktop': 1025,
        'desktop_plus': 1400
    }
    
    // mobile navigation toggle
    // On window for dev so that the include system can call it
    window.setNav = function(){
        var nav = $('header nav')
        $('#nav-button').on('click', function(e) {
            e.preventDefault();
            // Get header height - device specific
            var ipad = (window.innerWidth > deviceWidth.ipad);
            var navTop;
            if(ipad){
                navTop = '100px';
            }
            else
            {
                navTop = '60px';
            }
            // Slidy widy
            if($('body').hasClass('nav-open')){
                nav.animate({'top':'0', 'opacity': 0}, 150, function(){
                    $('body').toggleClass('nav-open');
                });
            }
            else{
                nav.css({'top': 'auto', 'bottom': '100%'});
                nav.animate({'top': navTop, 'opacity': 1}, 150);
                $('body').toggleClass('nav-open');
            };
            return false;
        });
        // Navigation enhancements for desktop
        $('#nav-link-venue').mouseenter(function(e){
            // Append the footer venue list to the header
            $('body').addClass('desktop-venue-nav');
        }).mouseleave(function(e){
            $('body').removeClass('desktop-venue-nav');
        });
    };
    window.setNav();

    var retina = (window.devicePixelRatio > 1);
    // On window for dev so that the include system can call it
    window.updateBackgrounds = function() {
        var ipad = (window.innerWidth > deviceWidth.ipad);
        // Update any DOM elements (div, i, etc) with the tagged class. This can be extended to cover <img> too!
        $('.dynamic-bg-img').each(function(i, el) {
            var source, el = $(el);
            // We have 3 cases: desktop (screen wider than 1024px), phone (smaller than 1024) and phone retina
            if (ipad) {
                source = el.data('imgDesktop');
            } else if (retina) {
                source = el.data('imgPhoneRetina');
            } else {
                source = el.data('imgPhone');
            }
            // If there's a desktop-plus img configured, use that. This is optional.
            if(el.data('imgDesktopPlus')){
                source = el.data('imgDesktopPlus');
            }
            // If source is undefined, bail out
            if(source==undefined){
                return false;
            }
            // Set the background image if the el is a DIV, or src if IMG
            var bg_size, bg_pos;
            if(el.hasClass('row')){
                bg_size = 'cover'
            };
            if(el.attr('data-bg-size')){
                bg_size = el.attr('data-bg-size');
            };
            if(el.attr('data-bg-pos')){
                bg_pos = el.attr('data-bg-pos');
            };
            if (el[0].tagName == 'DIV' || el[0].tagName == 'A' || el[0].tagName == 'LI') {
                el.css({'background-image': 'url(' + source + ')'});
                if (bg_size) {
                    el.css({'background-size': bg_size});
                }
                if (bg_pos) {
                    el.css({'background-position': bg_pos});
                }
            }
            if (el[0].tagName == 'IMG') {
                el.attr('src', source);
            }
            el.css({'background-repeat': 'no-repeat'});
        });
    };
    // Similar to BGs, but has a slightly different catchment width (ipad landscape and under)
    var updateDynamicLinks = function() {
        var desktop = (window.innerWidth > deviceWidth.desktop);
        $('.dynamic-link').each(function() {
            var self = $(this),
                postfix = desktop ? 'Desktop' : 'Phone',
                title = self.data('title' + postfix);
            self.attr('href', self.data('href' + postfix))
                .attr('title', title)
                .attr('target', self.data('target' + postfix))
                .html(title);
        });
    };
    $(window).on('resize', function(){
        updateBackgrounds(),
        updateDynamicLinks()
    });
    //.on('resize', repositionControls);
    updateBackgrounds();
    updateDynamicLinks();

});