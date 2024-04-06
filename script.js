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

function toggleAnonymousFields() {
    const anonymousCheckbox = document.getElementById('anonymous');
    const fullnameLabel = document.querySelector('label[for="fullname"]');
    const fullnameInput = document.getElementById('fullname');
    const emailLabel = document.querySelector('label[for="email"]');
    const emailInput = document.getElementById('email');
    const phoneLabel = document.querySelector('label[for="phone"]');
    const phoneInput = document.getElementById('phone');
    const commentsHeader = document.querySelector('h3');
    const commentsInput = document.getElementById('comments');
    const brElements = document.querySelectorAll('.hideable'); // Select by class

    if (anonymousCheckbox.checked) {
        // Set values to specific values when fields are hidden
        fullnameInput.value = 'Anonymous';
        emailInput.value = 'logimchurchonline@gmail.com';
        phoneInput.value = '2348022446543';
        commentsInput.value = 'No Comment';

        // Hide the labels, fields, and <br> elements
        fullnameLabel.style.display = 'none';
        fullnameInput.style.display = 'none';
        emailLabel.style.display = 'none';
        emailInput.style.display = 'none';
        phoneLabel.style.display = 'none';
        phoneInput.style.display = 'none';
        commentsHeader.style.display = 'none';
        commentsInput.style.display = 'none';

        // Hide <br> elements with the class "hideable"
        brElements.forEach(br => {
            br.style.display = 'none';
        });
    } else {
        // Clear the values when checkbox is unchecked
        fullnameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        commentsInput.value = '';

        // Show the labels, fields, and <br> elements
        fullnameLabel.style.display = 'block';
        fullnameInput.style.display = 'block';
        emailLabel.style.display = 'block';
        emailInput.style.display = 'block';
        phoneLabel.style.display = 'block';
        phoneInput.style.display = 'block';
        commentsHeader.style.display = 'block';
        commentsInput.style.display = 'block';

        // Show <br> elements with the class "hideable"
        brElements.forEach(br => {
            br.style.display = 'block';
        });
    }
}



function processPayment() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const comments = document.getElementById('comments').value;
    const terms = document.getElementById('terms').checked;
    const anonymousCheckbox = document.getElementById('anonymous');

    if (anonymousCheckbox.checked) {
        // If anonymous, clear specific fields
        document.getElementById('fullname').value = 'Anonymous';
        document.getElementById('email').value = 'logimchurchonline@gmail.com';
        document.getElementById('phone').value = '2348022446543';
        document.getElementById('comments').value = 'No Comment';
    } else {
        // Validate required fields
        if (fullname.trim() === '' || email.trim() === '' || phone.trim() === '' || amount.trim() === '' || category.trim() === '') {
            alert('Please fill out all required fields.');
            return; // Prevent form submission
        }
    }

    if (!category) {
        alert('Please choose a category.');
        return; // Prevent form submission
    }

    if (!amount) {
        alert('Please enter an amount.');
        return; // Prevent form submission
    }

    if (!terms) {
        alert('Please agree to the terms and conditions.');
        return; // Prevent form submission
    }

    // Construct payload for Flutterwave payment
    const paymentPayload = {
        fullname: fullname,
        email: email,
        phone: phone,
        amount: amount,
        currency: 'NGN',
        tx_ref: 'donation_' + Date.now(),
        redirect_url: 'https://logim-church.vercel.app/register.html',
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
            if (response.status === 'completed') {
                submitDonation(response); // Pass transaction ID to submitDonation function
            } else {
                alert('Payment failed. Please try again.');
            }
        },
        onclose: function() {
            //console.log('Payment window closed');
            // Refresh the page after the payment modal is closed
            window.location.reload();
        },
        customizations: {
            title: 'Light of God International Ministries',
            description: category,
            logo: 'https://logimchurchonline.sirv.com/Logo%20%26%20Designs/CHURCH_LOGO-removebg-preview.ico',
        }
    });
}

function submitDonation(response) {
    const form = document.getElementById('form4');
    const formData = new FormData(form);

    // Append transaction details to form data
    formData.append('charge_response_code', response.charge_response_code);
    formData.append('charge_response_message', response.charge_response_message);
    formData.append('charged_amount', response.charged_amount);
    formData.append('created_at', response.created_at);
    formData.append('currency', response.currency);
    formData.append('flw_ref', response.flw_ref);
    formData.append('redirectstatus', response.redirectstatus);
    formData.append('status', response.status);
    formData.append('transaction_id', response.transaction_id);
    formData.append('tx_ref', response.tx_ref);

    // Fetch to submit the form data to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbxy0PmATE8FbWisMKtMNsLb8KSL6IssAVPs6wKAVVWEIWJ_f4hZ32puyytgEyZqj682/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            //alert('Donation submitted successfully!');
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
