//nav.js
var projectMenu = false;
var hoveredProject=[ ];
var currentlyHovered=[ ];

$(document).ready(function () {
    $('nav .more').on('click', function(e){
        // change to title
        $('nav .more').addClass('menuTitle');
        $('nav .back').addClass('hidden');
        $('nav .contactBtn').addClass('hidden');

        $('nav').addClass('hovered');
        $('.projectMenu').removeClass('hidden');
        $('.closeMenu').removeClass('hidden');
        projectMenu=true;
    });

    $('.closeMenu').on('click', function(e){
        // change to title
        $('nav .more').removeClass('menuTitle');
        $('nav .back').removeClass('hidden');
        $('nav .contactBtn').removeClass('hidden');

        $('.projectMenu').addClass('hidden');
        $('.closeMenu').addClass('hidden');
        projectMenu=false;
    });

    $('nav, nav a').on('mouseenter', function(e){
        if(!projectMenu){
            $('.menuArrow').addClass('hidden');
        }
    });

    $('nav').on('mouseout', function(e){
        if(!projectMenu){
            $('nav').removeClass('hovered');
            $('.menuArrow').removeClass('hidden');
        }
    });

    $('.menuItem').on('mouseenter', function(e){
        $(this).closest('.menuItem').addClass('hover');

        for (i = 0; i < hoveredProject.length; i++) {

            if(hoveredProject[i].startsWith($(this).closest('.menuItem').attr('class').split(' ')[1])){
                // remove this so it doesn't animate anymore
                hoveredProject.splice(i, 1);
            }
        }

        // add to animation queue
        hoveredProject.push($(this).closest('.menuItem').attr('class').split(' ')[1]);

        // add this to currently hovered so it's not animated out while hovered
        currentlyHovered=$(this).closest('.menuItem').attr('class').split(' ')[1];

        // hide the project preview
        $(this).children('figure').addClass('hidden');

        // for each SVG
        $(this).children('svg').each(function(index) {
            var that = this;

            // set a timeout
            var t = setTimeout(function() {
                // to unhide/slide down
                $(that).removeClass('hidden');
            // based on the number of svg's that have been animated
            }, 200 * index);
        });
    });

    $('.menuItem').on('mouseleave', function(e){
        var count;
        currentlyHovered='';

        $(this).children('svg').each(function(index) {
            // for each svg
            var that = this;

            // set a timeout
            var t = setTimeout(function() {
                // to hide
                $(that).addClass('hidden');

            // calculated based on which child times 200ms
            }, 200 * index);

            // add to index so we know when to stagger the background change
            count=index;
        });

        if(hoveredProject[0] != currentlyHovered){
            var t = setTimeout(function() {
                // remove hovered class from next queued item
                $('.' + hoveredProject[0]).removeClass('hover');

                // show the project preview again
                $('.' + hoveredProject[0]).children('figure').removeClass('hidden');

                // remove next queued item from queue
                hoveredProject.shift( );
            }, 200 * (count + 1));
        }
    });
});
