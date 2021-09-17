let socket = io();

// Button.
function submitClick() {
    // Sends the website entered from the input to server.
    socket.emit("website", document.getElementById('website-url').value);
}

// Receives the email.
function receiveEmail(emails) {
    // Displays the email client-side.
    for(let i = 0; i < emails.length; i++){
        let email = document.createElement("p");
        email.innerText = emails[i];
        document.getElementById('email-display').appendChild(email);
    }
    console.log(emails);
}

// Receives the phone numbers.
function receivePhone(phones) {
    // Displays the email client-side.
    for(let i = 0; i < phones.length; i++){
        let phone = document.createElement("p");
        phone.innerText = phones[i];
        document.getElementById('phone-display').appendChild(phone);
    }
    console.log(phones);
}

socket.on("emails", receiveEmail);
socket.on("phone", receivePhone);