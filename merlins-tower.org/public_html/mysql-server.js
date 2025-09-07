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
    ssl: { rejectUnauthorized: false },
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

        res.status(201).location(`/static/${result.insertId}`).json({ id: result.insertId }); 
    } catch (err) {
        console.error('POST /static:', err);
        res.status(500).json({ error: 'insert_failed' }); 
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

        res.status(200).json(rows.map(r => ({
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
        res.status(500).json({ error: 'select_failed' });
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

        if (!rows.length) return res.status(404).json({ error: 'not_found' });

        const r = rows[0];
        res.status(200).json({
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
        res.status(500).json({ error: 'select_one_failed' });
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

        if (r.affectedRows === 0) return res.status(404).json({ error: 'not_found' });
        res.status(200).json({ updated: r.affectedRows });
    } catch (err) {
        console.error('PUT /static/:id:', err);
        res.status(500).json({ error: 'update_failed' });
    }
});

app.delete('/static/:id', async (req, res) => {
    try {
        const [r] = await pool.execute(`DELETE FROM static WHERE id=?`, [req.params.id]);
        if (r.affectedRows === 0) return res.status(404).json({ error: 'not_found' });
        res.sendStatus(204);
    } catch (err) {
        console.error('DELETE /static/:id:', err);
        res.status(500).json({ error: 'delete_failed' });
    }
});

// ------- PERFORMANCE -------
app.post('/performance', async (req, res) => {
  try {
    const type           = req.body?.type || 'performance';
    const timingJson     = JSON.stringify(req.body?.timing || {});
    const session        = req.body?.session ?? null;
    const loadStart      = ('loadStart'      in req.body) ? req.body.loadStart      : null;
    const loadEnd        = ('loadEnd'        in req.body) ? req.body.loadEnd        : null;
    const totalLoadTime  = ('totalLoadTime'  in req.body) ? req.body.totalLoadTime  : null;

    const [result] = await pool.execute(
      `INSERT INTO performance (type, timing, session, load_start, load_end, total_loadtime)
       VALUES (?,?,?,?,?,?)`,
      [type, timingJson, session, loadStart, loadEnd, totalLoadTime]
    );

    res.status(201).location(`/performance/${result.insertId}`).json({ id: result.insertId });
  } catch (err) {
    console.error('POST /performance:', err);
    res.status(500).json({ error: 'insert_failed' });
  }
});

app.get('/performance', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, type, timing, session, load_start, load_end, total_loadtime
         FROM performance
        ORDER BY id DESC`
    );

    res.status(200).json(rows.map(r => ({
      type: 'performance',
      timing: typeof r.timing === 'string' ? JSON.parse(r.timing) : (r.timing || {}),
      loadStart: r.load_start,
      loadEnd: r.load_end,
      totalLoadTime: r.total_loadtime,
      session: r.session,
      id: r.id
    })));
  } catch (err) {
    console.error('GET /performance:', err);
    res.status(500).json({ error: 'select_failed' });
  }
});

app.get('/performance/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, type, timing, session, load_start, load_end, total_loadtime
         FROM performance
        WHERE id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not_found' });

    const r = rows[0];
    res.status(200).json({
      type: 'performance',
      timing: typeof r.timing === 'string' ? JSON.parse(r.timing) : (r.timing || {}),
      loadStart: r.load_start,
      loadEnd: r.load_end,
      totalLoadTime: r.total_loadtime,
      session: r.session,
      id: r.id
    });
  } catch (err) {
    console.error('GET /performance/:id:', err);
    res.status(500).json({ error: 'select_one_failed' });
  }
});

app.put('/performance/:id', async (req, res) => {
  try {
    const type           = req.body?.type || 'performance';
    const timingJson     = JSON.stringify(req.body?.timing || {});
    const session        = req.body?.session ?? null;
    const loadStart      = ('loadStart'      in req.body) ? req.body.loadStart      : null;
    const loadEnd        = ('loadEnd'        in req.body) ? req.body.loadEnd        : null;
    const totalLoadTime  = ('totalLoadTime'  in req.body) ? req.body.totalLoadTime  : null;

    const [r] = await pool.execute(
      `UPDATE performance
          SET type=?, timing=?, session=?, load_start=?, load_end=?, total_loadtime=?
        WHERE id=?`,
      [type, timingJson, session, loadStart, loadEnd, totalLoadTime, req.params.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ error: 'not_found' });
    res.status(200).json({ updated: r.affectedRows });
  } catch (err) {
    console.error('PUT /performance/:id:', err);
    res.status(500).json({ error: 'update_failed' });
  }
});

app.delete('/performance/:id', async (req, res) => {
  try {
    const [r] = await pool.execute(`DELETE FROM performance WHERE id=?`, [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'not_found' });
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /performance/:id:', err);
    res.status(500).json({ error: 'delete_failed' });
  }
});

// ------- ACTIVITY -------
app.post('/activity', async (req, res) => {
  try {
    const session = req.body?.session ?? null;
    const logJson = JSON.stringify(req.body?.log || []);

    const [result] = await pool.execute(
      `INSERT INTO activity (session, log_json)
       VALUES (?, ?)`,
      [session, logJson]
    );

    res.status(201).location(`/activity/${result.insertId}`).json({ id: result.insertId });
  } catch (err) {
    console.error('POST /activity:', err);
    res.status(500).json({ error: 'insert_failed' });
  }
});

app.get('/activity', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, session, log_json
         FROM activity
        ORDER BY id DESC`
    );

    res.status(200).json(rows.map(r => ({
      type: 'activity',
      log: typeof r.log_json === 'string' ? JSON.parse(r.log_json) : (r.log_json || []),
      session: r.session,
      id: r.id
    })));
  } catch (err) {
    console.error('GET /activity:', err);
    res.status(500).json({ error: 'select_failed' });
  }
});

app.get('/activity/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, session, log_json
         FROM activity
        WHERE id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not_found' });

    const r = rows[0];
    res.status(200).json({
      type: 'activity',
      log: typeof r.log_json === 'string' ? JSON.parse(r.log_json) : (r.log_json || []),
      session: r.session,
      id: r.id
    });
  } catch (err) {
    console.error('GET /activity/:id:', err);
    res.status(500).json({ error: 'select_one_failed' });
  }
});

app.put('/activity/:id', async (req, res) => {
  try {
    const session = req.body?.session ?? null;
    const logJson = JSON.stringify(req.body?.log || []);

    const [r] = await pool.execute(
      `UPDATE activity
          SET session=?, log_json=?
        WHERE id=?`,
      [session, logJson, req.params.id]
    );

    if (r.affectedRows === 0) return res.status(404).json({ error: 'not_found' });
    res.status(200).json({ updated: r.affectedRows });
  } catch (err) {
    console.error('PUT /activity/:id:', err);
    res.status(500).json({ error: 'update_failed' });
  }
});

app.delete('/activity/:id', async (req, res) => {
  try {
    const [r] = await pool.execute(`DELETE FROM activity WHERE id=?`, [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'not_found' });
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /activity/:id:', err);
    res.status(500).json({ error: 'delete_failed' });
  }
});


app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
});