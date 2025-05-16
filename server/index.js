const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./weather.db');

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS weather (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zip TEXT,
  city TEXT,
  temperature REAL,
  timestamp TEXT
)`);

// API route to save weather data
app.post('/api/weather', (req, res) => {
  const { zip, city, temperature } = req.body;
  const timestamp = new Date().toISOString();

  db.run(
    `INSERT INTO weather (zip, city, temperature, timestamp) VALUES (?, ?, ?, ?)`,
    [zip, city, temperature, timestamp],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Data stored', id: this.lastID });
    }
  );
});

// API route to get recent weather data
app.get('/api/weather', (req, res) => {
  db.all(
    `SELECT * FROM weather ORDER BY timestamp DESC LIMIT 10`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
