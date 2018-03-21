$(document).ready(function() {
        $("#continueBtn").click(function(event) {

        event.preventDefault();

        $("#onboardingOverlay").toggleClass("hidden");
    });
});
