// Project Open
var project='';
var positions={ };
var currentPosition;

// get current position as soon as page loads
var newSection='';
var oldSection='';

var contact=false;
var currentPosition=0;

stop=0;
lastStop=0;
scrollDistance=0;

mobileStop=0;

function getScrollPositions(){
    // get direct children of body and turn that into an array
    var sectionParkingLot=document.querySelector('main').children;
    var sectionList=Array.from(sectionParkingLot);

    for (i = 0; i < sectionList.length; i++) {
        //check array for <section> children
        var element=sectionList[i].outerHTML.toString( );

        if(element.startsWith('<section')){
            //strip non-sections and get name for dictionary
            element=sectionList[i];

            //get the meta data first, then the FIRST classname (hence the split[0])
            var keyName=element.getAttribute('data-section-name');
            var valueName=element.className.split(' ')[0];

            //convert to section.something to get distance from top of the screen
            if(keyName=='Joel Wisneski'){
                var valueName=50;
            }else{
                var valueName='section.' + valueName;
                var valueName=$(valueName).offset().top-50;
            }

            //if it's a valid number add to the dictionary
            if(keyName!=null && valueName >= 0){
                positions[keyName]=valueName
            }
        }
    }
}

function getFirstPageScroll( ){
    stop = Math.round($(window).scrollTop());

    for(var key in positions){
        if(stop>positions[key]){
            newSection=key;

            if(newSection=='the savings launcher'){
                animateSavings(true);
            }

            if(newSection=='the mini bag'){
                animateMiniBag(true);
            }

            if(newSection=='the Nationwide app'){
                animateNW(true);
            }

            if(newSection=='company website'){
                animateIM(true);
            }
        }
    }
}

function pageScroll( ){
    // we round here to reduce a little workload
    lastStop=stop;
    stop = Math.round($(window).scrollTop());

    for(var key in positions){
        if(stop>positions[key]){
            newSection=key;
        }
    }

    if(oldSection!=newSection){
        oldSection=newSection;

        // get class name of element based on data-section-name
        var hash=$("body").find("[data-section-name='" + newSection + "']");
        hash=hash.attr('class').split(' ')[0];

        // update link with #id and update title with data-section-name
        //history.pushState(null, null, '#'+hash);
        changeTitle(newSection, '#'+hash);
    }

    // Check if examples should update
    if(newSection=='featured projects'){
        // scroll from savings launcher
        if(stop<lastStop){
            animateSavings(false);
        }

    }else if(newSection=='the savings launcher'){
        // scroll to savings launcher
        if(stop>lastStop){
            animateSavings(true);

            // check if within 200px of minibag
            if((stop+200) > positions['the mini bag']){
                var overlayOpacity=((stop-positions['the mini bag'])/2);

                $('.adLeft').css('opacity', overlayOpacity);
                $('.adRight').css('opacity', overlayOpacity);
                $('.adCenter').css('opacity', overlayOpacity);
                $('.adBelow').css('opacity', overlayOpacity);
            }

        // scroll to savings launcher from mini bag
        }else if(stop<lastStop){
            animateMiniBag(false);

            if((stop+200) > positions['the mini bag']){
                var overlayOpacity=((stop-positions['the mini bag'])/2);

                $('.adLeft').css('opacity', 1-(overlayOpacity * .01));
                $('.adRight').css('opacity', 1-(overlayOpacity * .01));
                $('.adCenter').css('opacity', 1-(overlayOpacity * .01));
                $('.adBelow').css('opacity', 1-(overlayOpacity * .01));
            }
        }

    }else if(newSection=='the mini bag'){
        // scroll to mini bag
        if(stop>lastStop){
            animateMiniBag(true);

        // scroll from NW to mini bag
        }else if(stop<lastStop){
            animateNW(false);
        }

    }else if(newSection=='the Nationwide app'){
        // scroll to nationwide app
        if(stop>lastStop){
            animateNW(true);

            if((stop+200) > positions['company website']){
                var topOffset=((stop-positions['company website'])/-100);

                $('.imAfter').css('top', topOffset+positions['company website']);
            }

        // scroll from company website to NW
        }else if(stop<lastStop){
            animateIM(false);
        }
    }

    else if(newSection=='company website'){
        // scroll to the company website
        if(stop>lastStop){
            animateIM(true);
        }
    }
}

function animateSavings(down){
    if(!down){
        // update the mobile example
        $('.autoPilotRow .switch').addClass('switchOff');

        $('.savingTotal').addClass('savingHidden');

        setTimeout(function(){
            $('.discount .baseOffer').addClass('disabled');
            $('.discount .switch').removeClass('switchHidden');
        }, 300);
    }else{
        // update the mobile example
        $('.autoPilotRow .switch').removeClass('switchOff');
        $('.savingTotal').removeClass('savingHidden');

        setTimeout(function(){
            $('.discount.first .baseOffer').removeClass('disabled');
            $('.discount.first .switch').addClass('switchHidden');

            setTimeout(function(){
                $('.discount.second .baseOffer').removeClass('disabled');
                $('.discount.second .switch').addClass('switchHidden');

                setTimeout(function(){
                    $('.discount.third .baseOffer').removeClass('disabled');
                    $('.discount.third .switch').addClass('switchHidden');
                }, 200);
            }, 200);
        }, 300);
    }
}

function animateMiniBag(down){
    if(!down){
        $('.flipProduct').removeClass('flipped');
        setTimeout(function(){
            //$('.discount .switch').removeClass('switchOff');
            $('.miniBagBackground').removeClass('miniBagOpen');
            $('.kohlsBagButton').removeClass('kohlsBagButtonOpen');
        }, 450);

    }else{
        $('.miniBagBackground').addClass('miniBagOpen');
        $('.kohlsBagButton').addClass('kohlsBagButtonOpen');
        setTimeout(function(){
            $('.flipProduct').addClass('flipped');
        }, 450);
    }
}

function animateNW(down){
    if(!down){
        $('.nationwide .IDCard').addClass('minimized');
    }else{
        $('.nationwide .IDCard').removeClass('minimized');
    }
}

function animateIM(down){
    if(!down){

    }else{

    }
}

function stopScroll( ){
    // we round here to reduce a little workload
    stop = Math.round($(window).scrollTop());
    $('main').animate({
        scrollTop: stop
    });
}

function scrollPage(pageSection){
    // scroll to section on page
    var sectionList = document.getElementsByClassName(pageSection);
    var targetSection;

    for (i = 0; i < sectionList.length; i++) {
        //check array for <section> children
        var element=sectionList[i].outerHTML.toString( );

        if(element.startsWith('<section')){
            //strip non-sections and get name for dictionary
            targetSection=sectionList[i];
            targetSection=targetSection.getAttribute('data-section-name');
            break;
        }
    }

    for(var key in positions){
        if(key==targetSection){
            var newPosition;

            if(key=='Joel Wisneski'){
                newPosition=0;
            }else{
                newPosition= positions[key];
                newPosition+=70;
            }

            var oldPosition = Math.round($(window).scrollTop());
            var timing = Math.abs((oldPosition-newPosition)*(3/7));
            Math.round(timing);

            $('main').animate({
                scrollTop: newPosition
            }, timing, 'swing');

            break;
        }
    }
}

// show contact section
function toggleContact(shown, newSection){
    if(!shown){
        //get position
        var newPosition;
        stop = Math.round($(window).scrollTop());

        mobileStop=stop;

        for(var key in positions){
            if(stop>positions[key]){
                newSection=key;
            }
        }

        $('.contact h3').removeClass('hideCopy');

        // show contact
        $('#contact').addClass('shown');
        changeTitle('Talk to Joel', '#contact');

        $('#contact input').select( );

        //this has to be old section to register properly in the pageScroll function
        oldSection='contact';

        $('.overlayContainer').addClass('overlayContainerShown');

        setTimeout(function(){
            // still trying to stop the scrtolling - this keeps
            // top of the page from flashing before the container shows up
            $('main').addClass('fixed');

            // add white background to overlay container to covery body text
            $('.overlayContainer').addClass('overlayContainerWhiteSpace');
        }, 500);

        //get the browser to check for mobile
        var browser = detectBrowser( );

        //For mobile devices add a fixed position on HTML
        if(browser=='Android' || browser=='iOS'){
            //add the HTML posiiton fixed style
            $('html').addClass('mobileOverflowFix');
       }
    } else{
        // close contact
        $('#contact').removeClass('shown');

        $('main').removeClass('fixed');
        $('.overlayContainer').removeClass('overlayContainerWhiteSpace');

        // wait for contact to animate up
        setTimeout(function(){
            $('.overlayContainer').removeClass('overlayContainerShown');
        }, 500);

        var browser = detectBrowser( );

        //remove the HTML posiiton fixed style
        $('html').removeClass('mobileOverflowFix');

        //scroll to last seen section on the page
        //scrollto:stop
        $('html, body, main').animate({
            scrollTop: mobileStop
        }, 0);

        // change the page name to the last seen section
        pageScroll( );
    }

    contact=!contact;
}

function toggleProject(element){
    if(element!=''){
        project=element;

        // get the screen position
        stop = Math.round($(window).scrollTop());

        // add for mobile
        mobileStop=stop;

        // display appropriate content? or fade in/slide up one by one?
        //show project container (slide up)
        $('section#'+project).addClass('shown');

        setTimeout(function(){
            // still trying to stop the scrtolling - this keeps
            // top of the page from flashing before the container shows up
            $('main').addClass('fixed');

            // add white background to overlay container to covery body text
            $('.overlayContainer').addClass('overlayContainerWhiteSpace');
        }, 500);

        // get the right project container
        var projectName=document.querySelector('section#' + project);

        //this has to be old section to register properly in the pageScroll function
        oldSection=project;

        // get browser to check for mobile
        var browser = detectBrowser( );

        //scroll to last section
         // if(browser=='Android' || browser=='iOS'){
            //add the HTML posiiton fixed style
            $('html').addClass('mobileOverflowFix');
        // }

    } else{
        // close project

        // set link title to last section
        pageScroll( );

        $('main').removeClass('fixed');
        $('.overlayContainer').removeClass('overlayContainerWhiteSpace');

        // wait for contact to animate up
        setTimeout(function(){
            $('.overlayContainer').removeClass('overlayContainerShown');
        }, 500);

        var browser = detectBrowser( );

        //scroll to last section
         // if(browser=='Android' || browser=='iOS'){
            //remove the HTML posiiton fixed style
            $('html').removeClass('mobileOverflowFix');

            //scroll to last seen section on the page
            $('main').animate({
                scrollTop: mobileStop
            }, 0);
        // }

        $('.shown').removeClass('shown');

        // wait for project to animate down
        setTimeout(function(){
            $('.overlayContainer').removeClass('overlayContainerShown');
        }, 500);

        $('.upArrow').removeClass('upArrowShown');
        project='';

        // enable .me .downArrow hover
        $('.me .downArrow').removeClass('downArrowMeHide');
    }
}

function randomNumber(upperLimit){
    var number= Math.floor(Math.random() * upperLimit);
    return number;
}

function randomColor(dark){
    darkColors = ['474647', '1F76DB', 'FA7921', '235789', '000'];
    lightColors = ['E7ECEF', 'fff'];

    var color='#';

    if(dark){
        //random dark color
        color+= darkColors[randomNumber(5)];
    }else{
        //random light color
        color+= lightColors[randomNumber(2)];
    }

    return color;
}

function detectBrowser( ){
    var browser = navigator.userAgent;

    if(browser.includes('Macintosh')){
        return 'OSX';

    }else if(browser.includes('iPhone') || browser.includes('iPad') || browser.includes('iPod')){
        return 'iOS';

    }else if(browser.includes('Android')){
        return 'Android';

    }else if(browser.includes('Windows')){
        return 'Windows'
    }
}

function updateEmailText( ){
    var browser = detectBrowser( );

    //Customize Copy Email Message
    if(browser=='OSX'){
        $('.contact h3').html('&#8984; + C to copy');
    }else if(browser=='Android' || browser=='iOS'){
        $('.contact h3').html('Press and hold to copy');
    }else if(browser=='Windows'){
        $('.contact h3').html('CTRL + C to copy');
    }
}

// Open pages with transitions
var main = document.querySelector('.projectContainer');
var cache = { };

function loadPage(url) {
  if (cache[url]) {
      return new Promise(function(resolve) {
      resolve(cache[url]);
    });
  }

  return fetch(url, {
    method: 'GET'
  }).then(function(response) {
    cache[url] = response.text();
    return cache[url];
  });
}

function changeTitle(newTitle, hash){
    $(document).prop('title', newTitle);
    history.pushState(null, null, hash);
}

function changePage() {
    // URL has already been changed in loadPage( );
    var url = window.location.href;

    loadPage(url).then(function(responseText) {
        var wrapper = document.createElement('section.project');

        wrapper.innerHTML = responseText;

        var oldContent = document.querySelector('main');
        //added .project to prevent doubling first section on reload of the homepage
        var newContent = wrapper.querySelector('section.project');

        var projectPage=main.appendChild(newContent);

        $('.projectContainer').removeClass('empty');
        animate(oldContent, newContent);

        $('.contactBtn').addEventListener('click', function( ){
            updateEmailText( );

            //scroll to that section
            toggleContact(contact, newSection);
        });
    });
}

function stripProjectContainer( ){
    var myNode = document.getElementsByClassName('projectContainer');
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function animate(oldContent, newContent) {
    var fadeOut = oldContent.animate({
        opacity: [1, 0]
}, 2000);

    var fadeIn = newContent.animate({
        opacity: [0, 1]
}, 2000);

    // Don't use this? keep old content and use it to speed up transitions
    fadeIn.onfinish = function() {
        oldContent.parentNode.removeChild(oldContent);
    };
}

window.addEventListener('popstate', changePage);

$(document).ready(function () {
    newSection='Joel Wisneski';
    oldSection='Joel Wisneski';

    getScrollPositions( );
    stripProjectContainer( );

    // check for animation start points
    getFirstPageScroll( );

    $('.contactBtn').on('click tap', function(e){
        //check for browser
        updateEmailText( );

        //scroll to that section
        toggleContact(contact, newSection);
    });

    $('.contact').on('click', function(e){
        // check if text is selected
        var text = "";
        if (typeof window.getSelection != "undefined") {
            text = window.getSelection().toString();
        } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }

        // remove any white space
        text.replace(/\s/g,'');

        // check if email is selected
        if(text=='Hi@Joelski.design'){
            $('.contact h3').removeClass('hideCopy');
        }else{
            $('.contact h3').addClass('hideCopy');
        }
    });

    $('.contact .downArrow').on('click', function(e){
        // scroll down on home page
        toggleContact(contact, newSection);
    });

    $('#icons .downArrow').on('click', function(e){
        // scroll down on home page
        pageScroll( );
        $('#icons').removeClass('shown');
    });

    $('#games .downArrow').on('click', function(e){
        // scroll down on home page
        pageScroll( );
        $('#games').removeClass('shown');
    });

    $( window ).resize(function(){
        getScrollPositions( );
        getFirstPageScroll( );
    });

    // scroll function changes "active" based on scrolling
    $(window).on('scroll',function(){
        //figure out where we are starting on the page (in window.load)
        if(project==''){
            pageScroll( );
        }
    });

    $(window).on("blur focus", function(e) {
        var prevType = $(this).data("prevType");
        var currentTitle=$(document).prop('title');

        if (prevType != e.type) {   //  reduce double fire issues
            switch (e.type) {
                case "blur":
                // do work
                changeTitle("Joel's Portfolio");

                break;
            case "focus":
                // do work
                changeTitle(currentTitle);

                break;
            }
        }

        $(this).data("prevType", e.type);
    });

    window.addEventListener("hashchange", function(e) {
        // hide contact on safari
        $('.contact').removeClass('contactShown');

        // Toggle contact (off)
        toggleContact(contact, newSection);
    });


    $('.icons').on('click tap', function(e){
        toggleProject('icons');
    });

    $('.games').on('click tap', function(e){
        toggleProject('games');
    });

    // $('div.music').on('click tap', function(e){
    //     toggleProject('music');
    // });

    $('.mobileProject').on('click tap', function(e){
        $('.nationwideAppProject .mobileProjectAnimation').each(function() {
            var elementPosition=$(this).position().top + $('.nationwideAppProject').scrollTop();
            elementPosition=(elementPosition + $(window).height() + $('.nationwideTop').height());

            var topOfContainer=$('.nationwideAppProject .nationwideTop').offsetParent().offset().top;
            topOfContainer=topOfContainer*-1;
        });
    });
});
