var flagged=false;

var calendarTimes=[ ];
var time = 1;

var scrollEvents={ };
var demoEvents={ };
var lastStop=0;
var stop=0;

var oldSection;
var newSection;

var contact=false;
var currentPosition=0;

var project='';

stop=0;
lastStop=0;
scrollDistance=0;

mobileStop=0;

var lastScreen; // used for NW

function updateFixedDevice(fixed, top){
    if(fixed){
        // so the phone will always start in the same place
        var testPhoneOffsetLeft=$('[data-section-name=' + newSection + '] .phoneDemo').offset().left;

        // add fixed class to phone
        $('[data-section-name=' + newSection + '] .testPhone').addClass('fixedPhone');

        // reset inline styles
        $('[data-section-name=' + newSection + '] .testPhone').removeAttr('style');

        // append .fixedPhone class with offsets
        // so phone is fixed at this location
        $('.fixedPhone').css({
            'left':testPhoneOffsetLeft,
            'top':'50px'
        });
    }else if(!fixed){
        // remove fixed class
        $('[data-section-name=' + oldSection + '] .testPhone').removeClass('fixedPhone');
        $('[data-section-name=' + oldSection + '] .testPhone').removeAttr('style');

        if(top){
            // fixed phone is below the viewport
            // move container to flex-start
            $('[data-section-name=' + oldSection + '] .phoneDemo').removeClass('containerAtBottom');
        }else{
            // fixed phone is above viewport
            $('[data-section-name=' + oldSection + '] .phoneDemo').addClass('containerAtBottom');
        }

        // workaround for NW because it has 2 demos
        if(newSection=='nationwideNav' && oldSection=='nationwideClaims'){
            $('[data-section-name=' + oldSection + '] .testPhone').removeClass('fixedPhone');
            $('[data-section-name=' + oldSection + '] .testPhone').removeAttr('style');
            $('[data-section-name=' + oldSection + '] .phoneDemo').removeClass('containerAtBottom');
        }
    }
}

function checkScreenUpdates(direction){
    var currentContent;

    if(oldSection=='savingsScrollDemo' || oldSection== 'watchScroll'
    || oldSection =='nationwideNav' || oldSection=='nationwideClaims'){
        var scrollSectionParkingLot=$('[data-section-name=' + oldSection + ']').find('.projectContent');
        var scrollSectionList=Array.from(scrollSectionParkingLot);

        demoEvents={ };

        for(m = 0; m < scrollSectionList.length; m++) {

            // get the unique identifier for each section
            var valueName=$(scrollSectionList[m]).attr('class').split(' ')[1];
            var keyValue=Math.round($('.' + valueName).offset().top);

            demoEvents[valueName]=keyValue;

            if(keyValue < (lastStop+200)){
                currentContent=valueName;
            }
        }

        // savingsLauncherScreens
        if(currentContent=='savingsSketch'){
            $('.savingsSketchScreen').removeClass('hiddenScreen');
            $('.savingsWireScreen').addClass('hiddenScreen');
            $('.savingsTestScreen').addClass('hiddenScreen');
        }else if(currentContent=='savingsWire'){
            $('.savingsSketchScreen').addClass('hiddenScreen');
            $('.savingsWireScreen').removeClass('hiddenScreen');
            $('.savingsTestScreen').addClass('hiddenScreen');
        }else if(currentContent=='savingsTest'){
            $('.savingsSketchScreen').addClass('hiddenScreen');
            $('.savingsWireScreen').addClass('hiddenScreen');
            $('.savingsTestScreen').removeClass('hiddenScreen');

            // miniBagScreens
        }else if(currentContent=='flippingContent'){
            $('.watch .flipProduct').removeClass('flipped');
        }else if(currentContent=='watchContent'){
            $('.watch .flipProduct').addClass('flipped');
            $('.watch .miniBagCardEarly').removeClass('cardHidden');
            $('.watch .miniBagCardLate').addClass('cardHidden');
        }else if(currentContent=='interactionsContent'){
            $('.watch .flipProduct').addClass('flipped');
            $('.watch .miniBagCardEarly').addClass('cardHidden');
            $('.watch .miniBagCardLate').removeClass('cardHidden');

            // nationwideNavScreens
        }else if(currentContent=='nwLoading'){
            $('.nwLoadingScreen').removeClass('screenHidden');
            $('.nwLoginScreen').addClass('screenHidden');
            lastScreen=currentContent;

        }else if(currentContent=='nwLogin'){
            $('.nwLoadingScreen').addClass('screenHidden');
            $('.nwLoginScreen').removeClass('screenHidden');
            $('.nwUnauthIDCardsScreen').addClass('screenHidden');
            $('.nwLoginScreen').removeClass('screenLeft');
            lastScreen=currentContent;

        }else if(currentContent=='nwUnauthIDCards'){
            if(lastScreen=='nwLogin'){
                $('.nwLoginScreen').addClass('screenLeft');
                $('.nwUnauthIDCardsScreen').removeClass('screenHidden');

                 console.log(lastScreen);
            }else{
                $('.nwPoliciesScreen').addClass('screenHidden');
                $('.nwLoginScreen').removeClass('screenHidden');

                setTimeout(function( ) { // wait for policies to hide
                    $('.nwLoginScreen').addClass('screenLeft');
                    $('.nwUnauthIDCardsScreen').removeClass('screenHidden');
                    console.log(lastScreen);
                    // add timeout for ID Card slide up
                }, 300);
            }
            lastScreen=currentContent;

        }else if(currentContent=='nwPolicies'){
            if(lastScreen=='nwUnauthIDCards'){
                $('.nwLoginScreen').toggleClass('screenLeft');
                $('.nwUnauthIDCardsScreen').toggleClass('screenHidden');

                timeout=true;

                setTimeout(function ( ) { // wait for policies to hide
                    $('.nwLoginScreen').addClass('screenHidden');
                    $('.nwPoliciesScreen').removeClass('screenHidden');
                    // add timeout for ID Card slide up
                }, 300);
            }else{
                $('.nwAuthIDCardsScreen').addClass('screenHidden');
                $('.nwPoliciesScreen').removeClass('screenHidden');
            }

            lastScreen=currentContent;

        }else if(currentContent=='nwIDCards'){
            $('.nwPoliciesScreen').addClass('screenHidden');
            $('.nwAuthIDCardsScreen').removeClass('screenHidden');

            //     // nationwideClaimsScreens
        }else if(currentContent=='nwClaimsSketch'){
            $('.nwClaimsSketchScreen').removeClass('screenHidden');
            $('.nwClaimsWireScreen').addClass('screenHidden');
        //
        }else if(currentContent=='nwClaimsWires'){
            $('.nwClaimsSketchScreen').addClass('screenHidden');
            $('.nwClaimsWireScreen').removeClass('screenHidden');
        }
    }
}

function checkDeviceDemo( ){
    var newFlag;
    var phoneBelow;

    if($('[data-section-name=' + newSection + '].deviceDemo')[0]){

        // check for top
        // gives you the absolute location of target based on the top of window
        var testPhoneOffsetTop=Math.round($('[data-section-name=' + newSection + '] .testPhone').offset().top);

        // gets top of section with phone inside
        var testSectionOffsetTop=Math.round($('[data-section-name=' + newSection + '].deviceDemo').offset().top);

        // get the current scrollbar position of the target
        var windowScroll=Math.round($(window).scrollTop());

        // equation to get location based on scroll
        var currentPhoneLocation=testSectionOffsetTop - windowScroll;

        //check for bottom
        if(currentPhoneLocation<=0){ // definitely not top
            // get height of section
            var sectionHeight=Math.round($('[data-section-name=' + newSection + '].deviceDemo').height( ));

            // add height to offset top +100 for margin-top/margin-bottom
            var sectionBottom=sectionHeight+testSectionOffsetTop+20;
            // "needs to change or be a percent of the height of the device

            // get window height
            var windowHeight=Math.round($(window).innerHeight());

            // add window height to scroll position to get bottom of window
            var windowBottom=windowScroll + windowHeight;

            // check if the bottom of the window is below the bottom of the section
            if((windowBottom - sectionBottom) >= 0){
                // not flagged
                newFlag=false;
                phoneBelow=false;
            }else{
                newFlag=true;
                phoneBelow=false;
            }
        }else{
            newFlag=false;
            phoneBelow=true;
        }



    }else if($('[data-section-name=' + oldSection + '].deviceDemo')[0]){
        newFlag=false;
        phoneBelow=true;
    }

    if(newFlag!=flagged){
        // flagged is "device is fixed"
        // phone below means placeholder should be flex-start
        updateFixedDevice(newFlag, phoneBelow);
        flagged=newFlag;
    }
}

function getTimelapseImages( ){
    // get direct children of body and turn that into an array
    var calendarParkingLot=document.querySelector('.miniBagTimelapse').children;
    var calendarList=Array.from(calendarParkingLot);

    for(i = 0; i < calendarList.length; i++) {
        // check array for <section> children
        var element=calendarList[i].outerHTML.toString( );

        if(element.startsWith('<div')){
            // strip non-sections and get name for dictionary
            element=calendarList[i];

            // get the FIRST classname (hence the split[0])
            var valueName=element.className.split(' ')[0];

            // add to array
            calendarTimes.push(valueName);
        }
    }
}

function loopTimelapse( ){
    $('.replayAnimation').removeClass('showReplay');
    $('.replayAnimation p').removeClass('showReplay');

    setTimeout(function ( ) {
        $('.' + calendarTimes[time]).addClass('shown');
        time++;
        if (time < calendarTimes.length+1) {
            loopTimelapse( );
        }else{
            // add replay button
            $('.replayAnimation').addClass('showReplay');
            $('.replayAnimation p').addClass('showReplay');

            // reset time for replay
            time=1;
        }
    }, 1000);
}

function replayTimelapse( ){
    // hide these while replaying
    $('.replayAnimation').removeClass('showReplay');
    $('.replayAnimation p').removeClass('showReplay');

    // remove shown class from all calendar divs (except the first)
    for(time=1; time < calendarTimes.length; time++){
        $('.' + calendarTimes[time]).removeClass('shown');
    }

    time=1;

    setTimeout(function ( ) {
        // wait to call loop timelapse so it doesn't skip immediately to screen 2
        loopTimelapse( );
    }, 500);
}

function getScrollEvents( ){
    // get direct children of body and turn that into an array
    var eventParkingLot=$('body').children('.scrollEvent');
    var eventList=Array.from(eventParkingLot);

    for(j = 0; j < eventList.length; j++) {
        // check array for <section> children
        var element=eventList[j].outerHTML.toString( );

        // get the unique identifier for each section
        var valueName=$(eventList[j]).attr('data-section-name');
        var keyValue=Math.round($('[data-section-name=' + valueName + ']').offset().top);

        scrollEvents[valueName]=keyValue;
    }
}

function pageScroll( ){
    // we round here to reduce a little workload
    lastStop=stop;
    stop = Math.round($(window).scrollTop());

    for(var key in scrollEvents){
        if(stop>scrollEvents[key]){
            newSection=key;
        }
    }

    if(stop<lastStop){ // UP //
        $('.backToHome').removeClass('upArrowFade');

        // minibag demos
        if(newSection=='miniBagHero'){
           animateMiniBag(false);
           checkDeviceDemo( );
       }else if(newSection=='watchScroll'){
            checkDeviceDemo( );
            checkScreenUpdates('up');
       }else if(newSection=='timelapseDemo'){

       }else if(newSection=='savingsDemoPreview' || newSection=='savingsHero'){
           animateSavings(false);
           checkDeviceDemo( );

       // Savings Launcher demos
       } else if(newSection=='savingsScrollDemo'){
           checkDeviceDemo( );
           checkScreenUpdates('up');

       }else if(newSection=='onboardingDemo'){

       // NW demos
       }else if(newSection=='nationwideHero'){
           animateNW(false);
           checkDeviceDemo( );
       }else if(newSection=='nationwideNav'){
           checkDeviceDemo( );
           checkScreenUpdates('up');
       }else if(newSection=='nationwideClaims'){
           checkDeviceDemo( );
           checkScreenUpdates('up');
       }

   }else if(stop>lastStop){ // DOWN //
        $('.backToHome').addClass('upArrowFade');

        if(oldSection=='watchScroll' && newSection=='timelapseDemo'){
            time=1;
            replayTimelapse( );

        // minibag demos
        }else if(newSection=='miniBagHero'){
           animateMiniBag(true);
       }else if(newSection=='watchScroll'){
           checkDeviceDemo( );
           checkScreenUpdates('down');
       }else if(newSection=='timelapseDemo'){

       }else if(newSection=='savingsDemoPreview' || newSection=='savingsHero'){
           animateSavings(true);

       // Savings Launcher demos
       } else if(newSection=='savingsScrollDemo'){
           checkDeviceDemo( );
           checkScreenUpdates('down');
       }else if(newSection=='onboardingDemo'){

       // NW demos
       }else if(newSection=='nationwideHero'){
           animateNW(true);
       }else if(newSection=='nationwideNav'){
           checkDeviceDemo( );
           checkScreenUpdates('down');
       }else if(newSection=='nationwideClaims'){
           checkDeviceDemo( );
           checkScreenUpdates('down');
       }
    }

    if(oldSection!=newSection){
        oldSection=newSection;
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
        $('.nationwideScreen .IDCard').addClass('minimized');
    }else{
        $('.nationwideScreen .IDCard').removeClass('minimized');
    }
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

// show contact section
function toggleContact(shown, newSection){
    if(!shown){
        //get position
        var newPosition;
        stop = Math.round($(window).scrollTop());

        $('.upArrow').removeClass('upArrowShown')
        mobileStop=stop;

        $('.contact h2').removeClass('hideCopy');

        // show contact
        $('.contact').addClass('contactShown');
        //changeTitle('Talk to Joel', '#contact');

        $('input.email').select( );

        //this has to be old section to register properly in the pageScroll function
        oldSection='contact';

        $('.overlayContainer').addClass('overlayContainerShown');

        setTimeout(function(){
            // add white background to overlay container to covery body text
            $('.overlayContainer').addClass('overlayContainerWhiteSpace');

            $('body').addClass('hideOverflow');
            $('body').addClass('bodyFixed');
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
        $('.contact').removeClass('contactShown');

        $('body').removeClass('hideOverflow');
        $('body').removeClass('bodyFixed');
        $('.overlayContainer').removeClass('overlayContainerWhiteSpace');

        // wait for contact to animate up
        setTimeout(function(){
            $('.overlayContainer').removeClass('overlayContainerShown');
        }, 500);

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

        $('.upArrow').addClass('upArrowShown');
    }
    contact=!contact;
}

function updateImages(device, image){

}

$(document).ready(function () {
    if ($('.miniBagTimelapse')[0]){
        // if the class exists on the page
        getTimelapseImages( );
    }

    getScrollEvents( );

    $('.replayAnimation').on('click tap', function( ){
        if(time==1){ // check to make sure the play function is done
            replayTimelapse( );
        }
    });

    $('.contact').on('click tap', function(e){
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

    $('.contactBtn').on('click tap', function(e){
        //check for browser
        updateEmailText( );

        //scroll to that section
        toggleContact(contact, newSection);
    });

    $( window ).resize(function(){
        getScrollEvents( );
    });

    $(window).scroll(function(){
        if($(window).innerWidth()>801){
            pageScroll( );
        }
    });

    $('.backToHome').on('mouseenter', function( ){
        $('.backToHome').removeClass('upArrowFade');
    });

    $('.backToHome').on('mouseleave', function( ){
        $('.backToHome').addClass('upArrowFade');
    });
});
