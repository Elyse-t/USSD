const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// DB Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // update if needed
    database: 'swiftpass'
});

db.connect(err => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';
    const input = text.split('*');

    switch (input.length) {
        case 1:
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

        case 2:
            if (input[0] === '1') {
                if (input[1] === '1') {
                    response = `CON Choose your destination:\n1. Kigali to Musanze\n2. Kigali to Huye`;
                } else if (input[1] === '2') {
                    response = `END Your phone number is ${phoneNumber}`;
                }
            } else if (input[0] === '2') {
                if (input[1] === '1') {
                    response = `CON Wählen Sie Ihr Ziel:\n1. Kigali nach Musanze\n2. Kigali nach Huye`;
                } else if (input[1] === '2') {
                    response = `END Ihre Telefonnummer ist ${phoneNumber}`;
                }
            } else if (input[0] === '3') {
                if (input[1] === '1') {
                    response = `CON Hitamo aho ugiye:\n1. Kigali - Musanze\n2. Kigali - Huye`;
                } else if (input[1] === '2') {
                    response = `END Nimero yawe ni ${phoneNumber}`;
                }
            }
            break;

        case 3:
            const lang = input[0];
            const dest = input[2] === '1' ? 'Kigali to Musanze' : 'Kigali to Huye';
            if (lang === '1') {
                response = `CON You selected ${dest}\n1. Confirm\n2. Cancel`;
            } else if (lang === '2') {
                response = `CON Sie haben ${dest} gewählt\n1. Bestätigen\n2. Abbrechen`;
            } else if (lang === '3') {
                const rwDest = input[2] === '1' ? 'Kigali - Musanze' : 'Kigali - Huye';
                response = `CON Wahisemo ${rwDest}\n1. Emeza\n2. Hindura`;
            }
            break;

        case 4:
            if (input[3] === '1') {
                const langKey = input[0];
                const langMap = { '1': 'English', '2': 'Deutsch', '3': 'Kinyarwanda' };
                const routeMap = {
                    '1': 'Kigali to Musanze',
                    '2': 'Kigali to Huye'
                };

                const language = langMap[langKey] || 'Unknown';
                const route = routeMap[input[2]] || 'Unknown';

                const sql = 'INSERT INTO bookings (phone_number, route, language) VALUES (?, ?, ?)';
                db.query(sql, [phoneNumber, route, language], (err, result) => {
                    if (err) {
                        console.error('Booking error:', err);
                    } else {
                        console.log(`Booking saved for ${phoneNumber}`);
                    }
                });

                if (langKey === '1') {
                    response = `END Your ticket has been booked successfully!\nYou will receive an SMS confirmation.`;
                } else if (langKey === '2') {
                    response = `END Ihr Ticket wurde erfolgreich gebucht!\nSie erhalten eine SMS-Bestätigung.`;
                } else if (langKey === '3') {
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

// HTML Bookings Page
app.get('/bookings', (req, res) => {
    const sql = 'SELECT * FROM bookings ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching bookings');
        }

        let html = `
            <h2>SwiftPass Bookings</h2>
            <table border="1" cellpadding="8" cellspacing="0">
                <tr>
                    <th>ID</th>
                    <th>Phone Number</th>
                    <th>Route</th>
                    <th>Language</th>
                    <th>Created At</th>
                </tr>`;

        results.forEach(row => {
            html += `
                <tr>
                    <td>${row.id}</td>
                    <td>${row.phone_number}</td>
                    <td>${row.route}</td>
                    <td>${row.language}</td>
                    <td>${row.created_at}</td>
                </tr>`;
        });

        html += `</table>`;
        res.send(html);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${3000}`);
});
