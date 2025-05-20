// database.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ussd.db");

// Create a table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS ussd_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      phone_number TEXT,
      user_input TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
