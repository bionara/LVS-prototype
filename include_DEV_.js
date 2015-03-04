$(document).ready(function() {

    /* 
        
        ARTEM - ignore this file completely. 

        THIS IS FOR DEV ONLY - to provide a simple file inclusion system to help backend CMS integration:
        Chrome doesn't let us load local files, so all html includes lives in here; html file includes in pages match that of the html file in include directory.
        This html is compressed (using coffeescript!) for easier stringifying to vars - see the include/ folder for the full html
    
    */

    var includeHtml = {
        'header.html': '',
        'footer.html': ''
    }

    $(".include").each(function(i,el){
        var el = $(el);
        console.log('include '+el.attr('data-inc'))
        el.html(includeHtml[el.attr('data-inc')]); 
        // It may have some includes within it...!
        $(".include", el).each(function(i,el){
            $(el).html(includeHtml[el.attr('data-inc')]);
        });
    });

    // Update any page functions after loading this into the template - necessary for dev js-include system only
    window.updateBackgrounds();
    window.setNav();

});