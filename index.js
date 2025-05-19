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
            response = `CON What would you like to check\n1. My account\n2. My phone number`;
            break;
        case '1':
            response = `CON Choose account information you want to view\n1. Account number`;
            break;
        case '2':
            response = `END Your phone number is ${phoneNumber}`;
            break;
        case '1*1':
            response = `END Your account number is ACC100101`;
            break;
        default:
            response = `END Invalid option`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
