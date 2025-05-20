const db = require("./database");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ussd.db');

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// USSD endpoint
app.post("/ussd", (req, res) => {
  const { sessionId = "", serviceCode = "", phoneNumber = "", text = "" } = req.body;

    // ✅ Log to SQLite database
  db.run(
    `INSERT INTO ussd_sessions (session_id, phone_number, user_input)
     VALUES (?, ?, ?)`,
    [sessionId, phoneNumber, text],
    (err) => {
      if (err) {
        console.error("DB insert error:", err.message);
      }
    }
  );
  const textArray = text.split("*");
  const level = textArray.length;

  let response = "";

  if (text === "") {
    response = "CON Buddy Welcome / Murakaza neza!\n";
    response += "1. English\n";
    response += "2. Kinyarwanda";
  } 
  else if (text === "1") {
    response = "CON Buddy Choose your favorite drink:\n";
    response += "1. Fanta\n";
    response += "2. Juice\n";
    response += "3. Tea";
  } 
  else if (text === "1*1") {
    response = "END You chose Fanta! You must be full of energy. Have a fizzy day!";
  } 
  else if (text === "1*2") {
    response = "END You chose Juice! You clearly value health and freshness. Stay healthy!";
  } 
  else if (text === "1*3") {
    response = "END You chose Tea! Calm and wise choice. Enjoy your tea time!";
  } 
  else if (text === "2") {
    response = "CON Buddy Hitamo icyo kunywa ukunda:\n";
    response += "1. Fanta\n";
    response += "2. Jus\n";
    response += "3. Icyayi";
  } 
  else if (text === "2*1") {
    response = "END Wahisemo Fanta! Ufite akanyamuneza n’imbaraga nyinshi. Umunsi mwiza!";
  } 
  else if (text === "2*2") {
    response = "END Wahisemo Jus! Ukunda ubuzima bwiza. Komeza ube muzima!";
  } 
  else if (text === "2*3") {
    response = "END Wahisemo Icyayi! Uyu ni umunsi mwiza wo kuruhuka. Ishimire icyayi!";
  } 
  else {
    response = "END Icyo wahisemo ntikibaho. Ongera ugerageze.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`USSD app running on port ${PORT}`);
});
