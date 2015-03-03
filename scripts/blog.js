$(document).ready(function(){
    $('.blog-nav-sm a').on('click', function(e){
        e.preventDefault();
        $('div.blog-nav-content').show();
        $('#blog-nav-sm-tags-el, #blog-nav-sm-search-el, #blog-nav-sm-archive-el').hide();
        $('nav#blog-nav').addClass('search-active');
        var show = '#' + $(e.target).attr('id') + '-el';
        $(show).show();
        return false;
    });
});