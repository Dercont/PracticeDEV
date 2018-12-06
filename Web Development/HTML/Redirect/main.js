//Get Redirect Button
var callBtn = document.getElementById('callBtn');

//Listen for Action
callBtn.addEventListener('click', pageRedirect);

//Function to Redirect
    function pageRedirect() {
        window.location.replace("index2.html");
    }      