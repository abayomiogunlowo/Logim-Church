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


// Donation page processes

function processPayment() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const comments = document.getElementById('comments').value;
    const terms = document.getElementById('terms').checked;

    if (!terms) {
        alert('Please agree to the terms and conditions.');
        return;
    }

    // Construct payload for Flutterwave payment
    const paymentPayload = {
        fullname: fullname,
        email: email,
        phone: phone,
        amount: amount,
        currency: 'NGN',
        tx_ref: 'donation_' + Date.now(),
        redirect_url: 'https://yourwebsite.com/thank-you',
        payment_options: 'card',
        meta: {
            donation_purpose: category
        }
    };

    // Initialize Flutterwave checkout
    FlutterwaveCheckout({
        public_key: 'FLWPUBK_TEST-a420e9f2953915878340cac0c2097b6d-X',
        tx_ref: paymentPayload.tx_ref,
        amount: paymentPayload.amount,
        currency: paymentPayload.currency,
        customer: {
            email: paymentPayload.email,
            phone_number: paymentPayload.phone,
            name: paymentPayload.fullname,
        },
        callback: function(response) {
            console.log(response);
            if (response.status === 'successful') {
                submitDonation(paymentPayload.tx_ref); // Pass transaction ID to submitDonation function
            } else {
                alert('Payment failed. Please try again.');
            }
        },
        onclose: function() {
            console.log('Payment window closed');
        },
        customizations: {
            title: 'Light of God International Ministries',
            description: category,
            logo: 'https://logimchurchonline.sirv.com/Logo%20%26%20Designs/CHURCH_LOGO-removebg-preview.ico',
        }
    });
}

function submitDonation(transactionId) {
    const form = document.getElementById('form4');
    const formData = new FormData(form);

    // Append transaction ID to form data
    formData.append('transaction_id', transactionId);

    fetch('https://script.google.com/macros/s/AKfycbxy0PmATE8FbWisMKtMNsLb8KSL6IssAVPs6wKAVVWEIWJ_f4hZ32puyytgEyZqj682/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Donation submitted successfully!');
            // Optionally reset the form after successful submission
            form.reset();
        } else {
            throw new Error('Failed to submit donation');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit donation. Please try again later.');
    });
}