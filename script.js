
var navLinks = document.getElementById("navLinks");

function showMenu() {
    navLinks.style.right = "0";
}

function hideMenu() {
    navLinks.style.right = "-200px";
}


// Forms Handler

document.addEventListener("DOMContentLoaded", function () {
    const form1 = document.getElementById("form1");
    const form2 = document.getElementById("form2");
    const form3 = document.getElementById("form3");

    function handleSubmit(event, form, thankYouMessage) {
        event.preventDefault(); // Prevent default form submission
        
        // Show the thank you popup with the provided message
        showThankYouPopup(thankYouMessage);

        // Reset the form
        form.reset();
    }

    form1.addEventListener("submit", function (event) {
        handleSubmit(event, form1, "Thank you for your message!");
    });

    form2.addEventListener("submit", function (event) {
        handleSubmit(event, form2, "Your information has been received, please check your email folder for confirmation!");
    });

    form2.addEventListener("submit", function (event) {
        handleSubmit(event, form3, "Your session has been schedulled, pending final review. Please check your email folder for confirmed date and time.");
    });
});

function showThankYouPopup(message) {
    // Display a popup/modal with the provided message
    alert(message);
}