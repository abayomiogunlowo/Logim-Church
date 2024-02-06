<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.js"></script>

var navLinks = document.getElementById("navLinks");

function showMenu() {
    navLinks.style.right = "0";
}

function hideMenu() {
    navLinks.style.right = "-200px";
}


$(document).ready(function() {
    $('#calendar').fullCalendar({
        googleCalendarApiKey: 'AIzaSyDDmQkNENe4B3SBeGHHXP067X6vOdYQbGc',
        events: {
            googleCalendarId: '2dd0d4895fdc5b6c8c4deb2ddc83fd7c00870b0760b1b1648b8fd76da551c96a@group.calendar.google.com',
        },
    });
});

