// public_html/mysql-server.js

const express = require('express');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const app = express();
app.use(express.json()); // lets Express read JSON bodies like req.body

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     +(process.env.DB_PORT || 25060),
  user:     process.env.DB_USER || 'doadmin',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'api',
  waitForConnections: true, connectionLimit: 5
});

// small helpers
const id7 = () => crypto.randomBytes(7).toString('base64url'); // short id like "j9FUNzt"
const b  = v => (v ? 1 : 0);                                    // bool -> tinyint(1)

// ---------- STATIC ----------
app.get('/api/static', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT id,userAgent,userLanguage,acceptsCookies,session,allowsJS,allowImage,allowCSS,screen_dimension,window_dimension
     FROM static`
  );
  res.json(rows.map(r => ({
    type: 'static',
    data: {
      userAgent: r.userAgent, userLanguage: r.userLanguage,
      acceptsCookies: !!r.acceptsCookies, allowsJS: !!r.allowsJS,
      allowImage: !!r.allowImage, allowCSS: !!r.allowCSS,
      screenDimensions: r.screen_dimension, windowDimensions: r.window_dimension
    },
    session: r.session, id: r.id
  })));
});

app.get('/api/static/:id', async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT id,userAgent,userLanguage,acceptsCookies,session,allowsJS,allowImage,allowCSS,screen_dimension,window_dimension
     FROM static WHERE id=?`, [req.params.id]);
  if (!rows.length) return res.status(404).json({error:'Not found'});
  const r = rows[0];
  res.json({
    type:'static',
    data: {
      userAgent:r.userAgent, userLanguage:r.userLanguage,
      acceptsCookies:!!r.acceptsCookies, allowsJS:!!r.allowsJS,
      allowImage:!!r.allowImage, allowCSS:!!r.allowCSS,
      screenDimensions:r.screen_dimension, windowDimensions:r.window_dimension
    },
    session:r.session, id:r.id
  });
});

app.post('/api/static', async (req, res) => {
  const id = req.body.id || id7();
  const d  = req.body.data || {};
  await pool.execute(
    `INSERT INTO static
     (id,userAgent,userLanguage,acceptsCookies,session,allowsJS,allowImage,allowCSS,screen_dimension,window_dimension)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [ id, d.userAgent||null, d.userLanguage||null, b(!!d.acceptsCookies),
      req.body.session||'', b(!!d.allowsJS), b(!!d.allowImage), b(!!d.allowCSS),
      d.screenDimensions||null, d.windowDimensions||null ]
  );
  res.status(201).json({ id });
});

app.put('/api/static/:id', async (req, res) => {
  const d = req.body.data || {};
  const [r] = await pool.execute(
    `UPDATE static SET userAgent=?,userLanguage=?,acceptsCookies=?,session=?,allowsJS=?,allowImage=?,allowCSS=?,screen_dimension=?,window_dimension=? WHERE id=?`,
    [ d.userAgent||null, d.userLanguage||null, b(!!d.acceptsCookies),
      req.body.session||'', b(!!d.allowsJS), b(!!d.allowImage), b(!!d.allowCSS),
      d.screenDimensions||null, d.windowDimensions||null, req.params.id ]
  );
  res.json({ updated: r.affectedRows });
});

app.delete('/api/static/:id', async (req, res) => {
  await pool.execute(`DELETE FROM static WHERE id=?`, [req.params.id]);
  res.sendStatus(204);
});

// ---------- PERFORMANCE ----------
app.get('/api/performance', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT type,id,timing,session,load_start,load_end,total_loadtime FROM performance`
  );
  res.json(rows.map(r => ({
    type:'performance',
    timing: r.timing ? JSON.parse(r.timing) : {},
    loadStart: r.load_start, loadEnd: r.load_end, totalLoadTime: r.total_loadtime,
    session: r.session, id: r.id
  })));
});

app.get('/api/performance/:id', async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT type,id,timing,session,load_start,load_end,total_loadtime FROM performance WHERE id=?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({error:'Not found'});
  const r = rows[0];
  res.json({
    type:'performance',
    timing: r.timing ? JSON.parse(r.timing) : {},
    loadStart: r.load_start, loadEnd: r.load_end, totalLoadTime: r.total_loadtime,
    session: r.session, id: r.id
  });
});

app.post('/api/performance', async (req, res) => {
  const id = req.body.id || id7();
  await pool.execute(
    `INSERT INTO performance (type,id,timing,session,load_start,load_end,total_loadtime)
     VALUES (?,?,?,?,?,?,?)`,
    [ req.body.type||'performance', id, JSON.stringify(req.body.timing||{}),
      req.body.session||'', req.body.loadStart??null, req.body.loadEnd??null, req.body.totalLoadTime??null ]
  );
  res.status(201).json({ id });
});

app.put('/api/performance/:id', async (req, res) => {
  const [r] = await pool.execute(
    `UPDATE performance SET type=?, timing=?, session=?, load_start=?, load_end=?, total_loadtime=? WHERE id=?`,
    [ req.body.type||'performance', JSON.stringify(req.body.timing||{}),
      req.body.session||'', req.body.loadStart??null, req.body.loadEnd??null,
      req.body.totalLoadTime??null, req.params.id ]
  );
  res.json({ updated: r.affectedRows });
});

app.delete('/api/performance/:id', async (req, res) => {
  await pool.execute(`DELETE FROM performance WHERE id=?`, [req.params.id]);
  res.sendStatus(204);
});

// ---------- ACTIVITY ----------
app.get('/api/activity', async (_req, res) => {
  const [rows] = await pool.query(`SELECT id,session,log_json FROM activity`);
  res.json(rows.map(r => ({ type:'activity', log: JSON.parse(r.log_json), session:r.session, id:r.id })));
});

app.get('/api/activity/:id', async (req, res) => {
  const [rows] = await pool.execute(`SELECT id,session,log_json FROM activity WHERE id=?`, [req.params.id]);
  if (!rows.length) return res.status(404).json({error:'Not found'});
  const r = rows[0];
  res.json({ type:'activity', log: JSON.parse(r.log_json), session:r.session, id:r.id });
});

app.post('/api/activity', async (req, res) => {
  const id = req.body.id || id7();
  await pool.execute(
    `INSERT INTO activity (id,session,log_json) VALUES (?,?,?)`,
    [ id, req.body.session||'', JSON.stringify(req.body.log||[]) ]
  );
  res.status(201).json({ id });
});

app.put('/api/activity/:id', async (req, res) => {
  const [r] = await pool.execute(
    `UPDATE activity SET session=?, log_json=? WHERE id=?`,
    [ req.body.session||'', JSON.stringify(req.body.log||[]), req.params.id ]
  );
  res.json({ updated: r.affectedRows });
});

app.delete('/api/activity/:id', async (req, res) => {
  await pool.execute(`DELETE FROM activity WHERE id=?`, [req.params.id]);
  res.sendStatus(204);
});

// start server
const PORT = +(process.env.PORT || 3001);
app.listen(PORT, () => console.log(`API ready on http://127.0.0.1:${PORT}/api`));
