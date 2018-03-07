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
    var sectionParkingLot=document.querySelector('.mainContainer').children;
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
}

function stopScroll( ){
    // we round here to reduce a little workload
    stop = Math.round($(window).scrollTop());
    $('html, body').animate({
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

            $('html, body').animate({
                scrollTop: newPosition
            }, timing, 'swing');

            break;
        }
    }
}

function showText( ){
    // show ',well'
    $('.me span').css('opacity', '1');
}

// show contact section
function toggleContact(shown, newSection){
    if(!shown){
        //get position
        var newPosition;
        stop = Math.round($(window).scrollTop());

        //hide arrow if need be
        if(project){
            $('.upArrow').removeClass('upArrowShown');
        }else{
            // setup mobile stop for later
            // does not overwrite if a project is open
            mobileStop=stop;
        }

        for(var key in positions){
            if(stop>positions[key]){
                newSection=key;
            }
        }

        $('.contact h2').removeClass('hideCopy');

        // show contact
        $('.contact').addClass('contactShown');
        changeTitle('Talk to Joel', '#contact');

        $('input.email').select( );

        //this has to be old section to register properly in the pageScroll function
        oldSection='contact';

        // $('.mainContainer').addClass('hideOverflow');
        $('body').addClass('hideOverflow');
        // $('html').addClass('hideOverflow');
        $('.overlayContainer').addClass('overlayContainerShown');

        //get the browser to check for mobile
        var browser = detectBrowser( );

        //For mobile devices add a fixed position on HTML
        if(browser=='Android' || browser=='iOS'){
            //add the HTML posiiton fixed style
            $('html').addClass('mobileOverflowFix');
       }
    } else{
        // close contact
        $('.contact').removeClass('contactShown');

        if(!project){
            // wait for contact to animate up
            setTimeout(function(){
                $('.overlayContainer').removeClass('overlayContainerShown');
            }, 500);

            // $('.mainContainer').removeClass('hideOverflow');
            $('body').removeClass('hideOverflow');
            // $('html').removeClass('hideOverflow');

            var browser = detectBrowser( );

            // scroll to last section
             // if(browser=='Android' || browser=='iOS'){
                //remove the HTML posiiton fixed style
                $('html').removeClass('mobileOverflowFix');

                //scroll to last seen section on the page
                //scrollto:stop
                $('html, body').animate({
                    scrollTop: mobileStop
                }, 0);
            // }
        }else{
            $('.upArrow').addClass('upArrowShown');
        }

        // change the page name to the last seen section
        pageScroll( );
    }

    contact=!contact;
}

function toggleProject(element){
    if(element!=''){
        element=element.replace('Link','');
        project=element;

        // get the screen position
        stop = Math.round($(window).scrollTop());

        // add for mobile
        mobileStop=stop;

        // display appropriate content? or fade in/slide up one by one?
        //show project container (slide up)
        $('.projectContainer.'+project+'Project').addClass('projectContainerShown');
        $('.overlayContainer').addClass('overlayContainerShown');
        $('.upArrow').addClass('upArrowShown');

        // get the right project container
        var projectName=document.querySelector('section.projectContainer.' + project);

        // get all children from project container and add them to an array
        //var sectionParkingLot=projectName.children;
        //var sectionList=Array.from(sectionParkingLot);

        // var descendants = projectName.querySelectorAll('*');
        // for (i = 0; i < descendants.length; i++) {
        //
        //     // check if you can run the include function
        //     if(descendants[i].className.includes){
        //         // check if the class name includes fadeUp
        //         if(descendants[i].className.includes('fadeUp')){
        //             // add these descendants to the new array
        //             descendants[i].removeClass('fadeUp');
        //         }
        //     }
        // }

        // format and change page link
        //var linkName = projectName.className.split(' ')[1];
        //projectName=projectName.getAttribute('data-section-name');
        //changeTitle(projectName, '#'+linkName);

        //this has to be old section to register properly in the pageScroll function
        oldSection=project;

        // keep body from scrolling while a project is open
        $('body').addClass('hideOverflow');

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

        $('body').removeClass('hideOverflow');
        var browser = detectBrowser( );

        //scroll to last section
         // if(browser=='Android' || browser=='iOS'){
            //remove the HTML posiiton fixed style
            $('html').removeClass('mobileOverflowFix');

            //scroll to last seen section on the page
            $('html, body').animate({
                scrollTop: mobileStop
            }, 0);
        // }

        $('.projectContainer').removeClass('projectContainerShown');

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
        $('.contact h2').html('&#8984; + C to copy');
    }else if(browser=='Android' || browser=='iOS'){
        $('.contact h2').html('Press and hold to copy');
    }else if(browser=='Windows'){
        $('.contact h2').html('CTRL + C to copy');
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

        var oldContent = document.querySelector('body');
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
    stripProjectContainer( )

    // for smaller screens, show ',well' on home
    // var width=$(window).width();
    // if(width<601){
    //     setTimeout(showText, 800);
    // }

    // Highlights for pagination dots/sections
    $('.pagination>div').on('mouseenter', function(e){
        if(e.target.className!='selected'){
            $(this).children('p').addClass('hovered');
            $(this).addClass('hoveredPage');
        }else{
            e.preventDefault( );
        }
    });

    $('.pagination>div').on('mouseleave', function(e){
        $(this).children('p').removeClass('hovered');
        $(this).removeClass('hoveredPage');
    });

    $('.pagination>div').on('click', function(e){
        //scroll to that section
        var pageSection = $(this).children('p').text();
        scrollPage(pageSection);
    });

    $('.pagination div').on('click tap', function (event) {
        // this one needs some work
        var linkName = event.target.className.split(' ')[0];

        // get the section name
        linkName = linkName.replace('Link', ' ');
        linkName = '#' + linkName;

        $('html, body').animate({
            scrollTop: $(linkName).offset().top - 60
        }, 500, 'swing');
    });

    $('.projects>div').on('mouseenter', function(e){
        if(e.currentTarget.className=='guitar' || e.currentTarget.className=='furniture'){
        }else{
            $(this).addClass('projectHovered');
        }
    });

    $('.projects>div').on('mouseleave', function(e){
        $(this).removeClass('projectHovered');
    });

    $('.contactBtn').on('mouseenter', function(e){
        $(this).children('.downArrow').addClass('hovered')
    });

    $('.contactBtn').on('mouseleave', function(e){
        $(this).children('.downArrow').removeClass('hovered')
    });

    $('.contactBtn').on('click', function(e){
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
            $('.contact h2').removeClass('hideCopy');
        }else{
            $('.contact h2').addClass('hideCopy');
        }
    });

    $('.me .downArrow').on('click', function(e){
        // scroll down on home page
        if(!contact){
            var position = $('.me').height( );
            $('html, body').animate({
                scrollTop: position
            }, 400, 'swing');
        }
    });

    $('.featured .downArrow').on('click', function(e){
        // scroll down on home page
        var position=$('section.savings .pageTitle').offset().top-50;
        $('html, body').animate({
            scrollTop: position
        }, 400, 'swing');
    });

    $('.upArrow').on('click tap', function(){
        toggleProject('');
    });

    $( window ).resize(function(){
        getScrollPositions( );
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

    $('a.savingsLink').on('click tap', function(e){
        if(e.currentTarget.className=='nounProject'){
            window.open('https://thenounproject.com/joelski/', '_blank');
        }else{
            //get class name of project clicked
            var element=e.currentTarget;
            var element=element.className.split(' ')[0];
            toggleProject(element);
        }
    });

    $('a.miniBagLink').on('click tap', function(e){
        e.preventDefault( );
        if(e.currentTarget.className=='nounProject'){
            window.open('https://thenounproject.com/joelski/', '_blank');
        }else{
            //get class name of project clicked
            var element=e.currentTarget;
            var element=element.className.split(' ')[0];
            toggleProject(element);
        }
    });

    $('a.nationwideAppLink').on('click tap', function(e){
        if(e.currentTarget.className=='nounProject'){
            window.open('https://thenounproject.com/joelski/', '_blank');
        }else{
            //get class name of project clicked
            var element=e.currentTarget;
            var element=element.className.split(' ')[0];
            toggleProject(element);
        }
    });

    $('a.imageMattersLink').on('click tap', function(e){
        if(e.currentTarget.className=='nounProject'){
            window.open('https://thenounproject.com/joelski/', '_blank');
        }else{
            //get class name of project clicked
            var element=e.currentTarget;
            var element=element.className.split(' ')[0];
            toggleProject(element);
        }
    });

    $('div.icons').on('click tap', function(e){
        toggleProject('icons');
    });

    $('div.games').on('click tap', function(e){
        toggleProject('games');
    });

    // $('div.music').on('click tap', function(e){
    //     toggleProject('music');
    // });
});
