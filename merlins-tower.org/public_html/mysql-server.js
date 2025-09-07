const express = require('express');      
const mysql = require('mysql2/promise');   
require('dotenv').config();  // reads variables from .env

const app = express();
app.use(express.json()); // lets Express read JSON bodies like req.body

const PORT = 3001;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, 
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, service: 'api', time: new Date().toISOString() });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.status(200).json({ ok: rows[0].ok === 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'DB connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});