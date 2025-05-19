const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    switch (text) {
        case '':
            response = `CON Welcome to SwiftPass\n1. Book a ticket\n2. My phone number`;
            break;

        case '1':
            response = `CON Choose your destination:\n1. Kigali to Musanze\n2. Kigali to Huye`;
            break;

        case '1*1':
            response = `CON You selected Kigali to Musanze\n1. Confirm\n2. Cancel`;
            break;

        case '1*2':
            response = `CON You selected Kigali to Huye\n1. Confirm\n2. Cancel`;
            break;

        case '1*1*1':
        case '1*2*1':
            response = `END Your ticket has been booked successfully!\nYou will receive an SMS confirmation.`;
            break;

        case '1*1*2':
        case '1*2*2':
            response = `END Ticket booking cancelled.`;
            break;

        case '2':
            response = `END Your phone number is ${phoneNumber}`;
            break;

        default:
            response = `END Invalid option. Please try again.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${3000}`);
});
