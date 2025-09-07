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
    connectionLimit: 5
});

// ------- STATIC -------
app.post('/static', async (req, res) => {
    try {
        const d = (req.body && req.body.data) || {};
        const session = (req.body && req.body.session) || null;

        const [result] = await pool.execute(
        `INSERT INTO static
        (userAgent, userLanguage, acceptsCookies, session,
            allowsJS, allowImage, allowCSS, screen_dimension, window_dimension)
        VALUES (?,?,?,?,?,?,?,?,?)`,
        [
            d.userAgent || null,
            d.userLanguage || null,
            d.acceptsCookies ? 1 : 0,
            session,
            d.allowsJS ? 1 : 0,
            d.allowImage ? 1 : 0,
            d.allowCSS ? 1 : 0,
            d.screenDimensions || null,
            d.windowDimensions || null
        ]
        );

        res.json({ id: result.insertId }); // default 200
    } catch (err) {
        console.error('POST /static:', err);
        res.json({ error: 'insert_failed' }); 
    }
});

app.get('/static', async (_req, res) => {
    try {
        const [rows] = await pool.query(
        `SELECT id,userAgent,userLanguage,acceptsCookies,session,
                allowsJS,allowImage,allowCSS,screen_dimension,window_dimension
            FROM static
            ORDER BY id DESC`
        );

        res.json(rows.map(r => ({
        type: 'static',
        data: {
            userAgent:        r.userAgent,
            userLanguage:     r.userLanguage,
            acceptsCookies:   !!r.acceptsCookies,
            allowsJS:         !!r.allowsJS,
            allowImage:       !!r.allowImage,
            allowCSS:         !!r.allowCSS,
            screenDimensions: r.screen_dimension,
            windowDimensions: r.window_dimension
        },
        session: r.session,
        id: r.id
        })));
    } catch (err) {
        console.error('GET /static:', err);
        res.json({ error: 'select_failed' });
    }
});

app.get('/static/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
        `SELECT id,userAgent,userLanguage,acceptsCookies,session,
                allowsJS,allowImage,allowCSS,screen_dimension,window_dimension
            FROM static
            WHERE id=?`,
        [req.params.id]
        );

        if (!rows.length) return res.json({ error: 'not_found' });

        const r = rows[0];
        res.json({
        type: 'static',
        data: {
            userAgent:        r.userAgent,
            userLanguage:     r.userLanguage,
            acceptsCookies:   !!r.acceptsCookies,
            allowsJS:         !!r.allowsJS,
            allowImage:       !!r.allowImage,
            allowCSS:         !!r.allowCSS,
            screenDimensions: r.screen_dimension,
            windowDimensions: r.window_dimension
        },
        session: r.session,
        id: r.id
        });
    } catch (err) {
        console.error('GET /static/:id:', err);
        res.json({ error: 'select_one_failed' });
    }
});

app.put('/static/:id', async (req, res) => {
    try {
        const d = (req.body && req.body.data) || {};
        const session = (req.body && ('session' in req.body ? req.body.session : null));

        const [r] = await pool.execute(
        `UPDATE static
            SET userAgent=?,
                userLanguage=?,
                acceptsCookies=?,
                session=?,
                allowsJS=?,
                allowImage=?,
                allowCSS=?,
                screen_dimension=?,
                window_dimension=?
            WHERE id=?`,
        [
            d.userAgent || null,
            d.userLanguage || null,
            d.acceptsCookies ? 1 : 0,
            session,
            d.allowsJS ? 1 : 0,
            d.allowImage ? 1 : 0,
            d.allowCSS ? 1 : 0,
            d.screenDimensions || null,
            d.windowDimensions || null,
            req.params.id
        ]
        );

        if (r.affectedRows === 0) return res.json({ error: 'not_found' });
        res.json({ updated: r.affectedRows });
    } catch (err) {
        console.error('PUT /static/:id:', err);
        res.json({ error: 'update_failed' });
    }
});

app.delete('/static/:id', async (req, res) => {
    try {
        const [r] = await pool.execute(`DELETE FROM static WHERE id=?`, [req.params.id]);
        if (r.affectedRows === 0) return res.json({ error: 'not_found' });
        res.json({ deleted: true });
    } catch (err) {
        console.error('DELETE /static/:id:', err);
        res.json({ error: 'delete_failed' });
    }
});

app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
});