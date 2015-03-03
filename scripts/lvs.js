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

    // Set up js carousels, done with Owl carousel plugin
    var repositionControls = function() {
        var el = $('.carousel');
        if (el.length) {
            var anchor = $(el.data('stickTo')),
                controls = $('.owl-controls');
            controls.css({
                top: anchor.position().top - 15,
                left: anchor.offset().left - el.offset().left
            });
        }
    };

    if ($.fn.owlCarousel) {
        $('.carousel').each(function(i, el) {
            var el = $(el);
            el.owlCarousel({
                items: 1,
                slideSpeed : 300,
                paginationSpeed : 400,
                singleItem: true
                //afterInit: repositionControls
            });
        });
    }
    // Some carousels only appear on ipad+
    var updateCarousels = function(){
        var ipad = (window.innerWidth > deviceWidth.ipad);
        if(ipad){
            $('.ipad-carousel').each(function(i, el) {
                var el = $(el);
                el.owlCarousel({
                    items: 1,
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    singleItem: true,
                    //afterInit: repositionControls
                });
            });
        }   
    }

    // Enhancements for retina.js
    // more a work in progress for dev - should be optimised and moved to retina.js later
    /* To use, set the following on the DOM object:
        class="dynamic-bg-img"
        style="background-image: url({{ content_image_phone.url }})"
        data-img-phone="{{ content_image_phone.url }}"
        data-img-phone-retina="{{ content_image_phone_retina.url }}" 
        data-img-desktop="{{ content_image_desktop.url }}"
        // OPTIONAL super big one!
        data-img-desktop-plus="{{ content_image_desktop_plus.url }}"
    */
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
        updateDynamicLinks(),
        updateCarousels()
    });
    //.on('resize', repositionControls);
    updateBackgrounds();
    updateDynamicLinks();
    updateCarousels();

    // On window for dev so that the include system can call it
    window.updateLVBFunctions = function(){
    
        // Homepage bar data toggler
        $('#home .bar-data').hide();
        $('#home .bar-overview a').click(function(e){
            // This is for iphone only
            var ipad = (window.innerWidth > deviceWidth.ipad);
            if(ipad){ return true; }
            $($(e.target).attr('data-show')).toggle();
            // And hide the image tabs for all bars [only the actice content should show]
            // Also hide all elements tagged with .hidden-when-bar-data-open
            $('#home .bar-overview, .hidden-when-bar-data-open').toggle();
            e.preventDefault();
            // Scroll to it, with header offset removed
            $('body').scrollTop($($(e.target).attr('data-show')).offset().top-60)
            return false;
        });

        // Booking form input toggler (can be used elsewhere with the data-toggles-content="#content-id")
        $("[data-toggles-content]").each(function(i,el){
            var el = $(el);
            var content = $(el.attr("data-toggles-content"))
            // Hide its hidden content
            content.hide();
            // Set listener for showing content
            el.on('change', function(e){
                openExtendedForm(el, content);
                // If it's desktop, redirect to the page with lv bar/franchise open
                if(window.innerWidth>=deviceWidth.ipad && $('body#home').length){
                    window.location = 'index-selected.html'
                }
            });
        });

        // Generic content toggler (show/hide)
        $('.content-toggle-link').each(function(i,el){
            var el = $(el)
            var content = el.parent().find(($(el).attr('data-toggle')));
            content.hide();
            el.click(function(e){
                e.preventDefault();
                content.toggle();
                // Toggle text/arrow
                if($('i.arrow-down', el).length){
                    el.html('Hide details<i class="arrow-up"></i>');
                }
                else {
                    el.html('Show details<i class="arrow-down"></i>');
                }
                return false;
            });
        });
    }

    var openExtendedForm = function(el, content){
        content.show();
        // remove the .collapsed
        el.closest('.collapsed').removeClass('collapsed').addClass('form-open');
        // Set up close
        el.closest('form').find('.close-form').click(function(e){
            e.preventDefault();
            content.hide();
            el.closest('.form-open').removeClass('form-open').addClass('collapsed');
            return false;
        });
    }
});