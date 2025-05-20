const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';
    const input = text.split('*');

    switch (input.length) {
        case 1: // Language Selection
            if (text === '') {
                response = `CON Choose your language:\n1. English\n2. Deutsch\n3. Kinyarwanda`;
            } else if (text === '1') {
                response = `CON Welcome to SwiftPass\n1. Book a ticket\n2. My phone number`;
            } else if (text === '2') {
                response = `CON Willkommen bei SwiftPass\n1. Ticket buchen\n2. Meine Telefonnummer`;
            } else if (text === '3') {
                response = `CON Murakaza neza kuri SwiftPass\n1. Gura itike\n2. Nimero yanjye`;
            } else {
                response = `END Invalid option.`;
            }
            break;

        case 2: // After selecting language
            if (input[0] === '1') { // English
                if (input[1] === '1') {
                    response = `CON Choose your destination:\n1. Kigali to Musanze\n2. Kigali to Huye`;
                } else if (input[1] === '2') {
                    response = `END Your phone number is ${phoneNumber}`;
                }
            } else if (input[0] === '2') { // Deutsch
                if (input[1] === '1') {
                    response = `CON Wählen Sie Ihr Ziel:\n1. Kigali nach Musanze\n2. Kigali nach Huye`;
                } else if (input[1] === '2') {
                    response = `END Ihre Telefonnummer ist ${phoneNumber}`;
                }
            } else if (input[0] === '3') { // Kinyarwanda
                if (input[1] === '1') {
                    response = `CON Hitamo aho ugiye:\n1. Kigali - Musanze\n2. Kigali - Huye`;
                } else if (input[1] === '2') {
                    response = `END Nimero yawe ni ${phoneNumber}`;
                }
            }
            break;

        case 3: // Destination selected
            if (input[2] === '1') {
                if (input[0] === '1') {
                    response = `CON You selected Kigali to Musanze\n1. Confirm\n2. Cancel`;
                } else if (input[0] === '2') {
                    response = `CON Sie haben Kigali nach Musanze gewählt\n1. Bestätigen\n2. Abbrechen`;
                } else if (input[0] === '3') {
                    response = `CON Wahisemo Kigali - Musanze\n1. Emeza\n2. Hindura`;
                }
            } else if (input[2] === '2') {
                if (input[0] === '1') {
                    response = `CON You selected Kigali to Huye\n1. Confirm\n2. Cancel`;
                } else if (input[0] === '2') {
                    response = `CON Sie haben Kigali nach Huye gewählt\n1. Bestätigen\n2. Abbrechen`;
                } else if (input[0] === '3') {
                    response = `CON Wahisemo Kigali - Huye\n1. Emeza\n2. Hindura`;
                }
            }
            break;

        case 4: // Confirmation
            if (input[3] === '1') {
                if (input[0] === '1') {
                    response = `END Your ticket has been booked successfully!\nYou will receive an SMS confirmation.`;
                } else if (input[0] === '2') {
                    response = `END Ihr Ticket wurde erfolgreich gebucht!\nSie erhalten eine SMS-Bestätigung.`;
                } else if (input[0] === '3') {
                    response = `END Itike yawe yamaze kugurwa!\nUzakira ubutumwa bugufi bwemeza.`;
                }
            } else if (input[3] === '2') {
                if (input[0] === '1') {
                    response = `END Ticket booking cancelled.`;
                } else if (input[0] === '2') {
                    response = `END Ticketbuchung abgebrochen.`;
                } else if (input[0] === '3') {
                    response = `END Kugura itike byahagaritswe.`;
                }
            }
            break;

        default:
            response = `END Invalid input. Please try again.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${3000}`);
});
