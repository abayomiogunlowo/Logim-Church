var navLinks = document.getElementById("navLinks");
var modal = document.getElementById("modal");
var modalMessage = document.getElementById("modal-message");

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
        
        // Set the message in the modal
        modalMessage.textContent = thankYouMessage;
        
        // Show the modal
        modal.style.display = "block";

        // Optionally, close the modal after a certain time
        //setTimeout(function() {
            //modal.style.display = "none";
        //}, 3000); // Adjust the timeout as needed

        // Send form data asynchronously
        const formData = new FormData(form);
        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Form submitted successfully');
        })
        .catch(error => {
            console.error('Error submitting form:', error.message);
        });
        
        // Optionally, reset the form
        form.reset();
    }

    document.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Determine which form triggered the event
        if (event.target === form1) {
            handleSubmit(event, form1, "Thank you for your message!");
        } else if (event.target === form2) {
            handleSubmit(event, form2, "Your information has been received, please check your email folder for confirmation!");
        } else if (event.target === form3) {
            handleSubmit(event, form3, "Your session has been scheduled, pending final review. Please check your email folder for confirmed date and time.");
        }
    });

    // Close the modal when the close button is clicked
    document.getElementsByClassName("close")[0].onclick = function() {
        modal.style.display = "none";
    }
});
