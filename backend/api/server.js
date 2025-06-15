const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to query database
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// CRUD endpoints for news_posts
app.get('/news_posts', async (req, res) => {
  try {
    const news = await query('SELECT * FROM news_posts ORDER BY date DESC');
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/news_posts', async (req, res) => {
  try {
    const { title, content, date, icon, attachments } = req.body;
    const result = await query(
      'INSERT INTO news_posts (title, content, date, icon, attachments) VALUES (?, ?, ?, ?, ?)',
      [title, content, date, icon, JSON.stringify(attachments)]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT endpoint for news_posts
app.put('/news_posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, date, icon, attachments } = req.body;
    const result = await query(
      'UPDATE news_posts SET title = ?, content = ?, date = ?, icon = ?, attachments = ? WHERE id = ?',
      [title, content, date, icon, JSON.stringify(attachments), id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News post not found' });
    }
    res.json({ message: 'News post updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE endpoint for news_posts
app.delete('/news_posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM news_posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News post not found' });
    }
    res.json({ message: 'News post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Additional CRUD endpoints for traffic_infos, schedules, materiels_roulants, stations can be added similarly

// CRUD endpoints for traffic_infos
app.get('/traffic_infos', async (req, res) => {
  try {
    const infos = await query('SELECT * FROM traffic_infos ORDER BY start_date DESC');
    res.json(infos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/traffic_infos', async (req, res) => {
  try {
    const { title, description, start_date, end_date, impact_type } = req.body;
    const result = await query(
      'INSERT INTO traffic_infos (title, description, start_date, end_date, impact_type) VALUES (?, ?, ?, ?, ?)',
      [title, description, start_date, end_date, impact_type]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT endpoint for traffic_infos
app.put('/traffic_infos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, impact_type } = req.body;
    const result = await query(
      'UPDATE traffic_infos SET title = ?, description = ?, start_date = ?, end_date = ?, impact_type = ? WHERE id = ?',
      [title, description, start_date, end_date, impact_type, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Traffic info not found' });
    }
    res.json({ message: 'Traffic info updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE endpoint for traffic_infos
app.delete('/traffic_infos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM traffic_infos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Traffic info not found' });
    }
    res.json({ message: 'Traffic info deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD endpoints for schedules
app.get('/schedules', async (req, res) => {
  try {
    const schedules = await query('SELECT * FROM schedules ORDER BY departure_time');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/schedules', async (req, res) => {
  try {
    const { train_number, departure_station, arrival_station, departure_time, arrival_time, train_type, composition, delay_minutes, is_cancelled } = req.body;
    const result = await query(
      'INSERT INTO schedules (train_number, departure_station, arrival_station, departure_time, arrival_time, train_type, composition, delay_minutes, is_cancelled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [train_number, departure_station, arrival_station, departure_time, arrival_time, train_type, JSON.stringify(composition), delay_minutes, is_cancelled]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD endpoints for materiels_roulants
app.get('/materiels_roulants', async (req, res) => {
  try {
    const materiels = await query('SELECT * FROM materiels_roulants ORDER BY name');
    res.json(materiels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/materiels_roulants', async (req, res) => {
  try {
    const { name, type, image_data, image_name } = req.body;
    const result = await query(
      'INSERT INTO materiels_roulants (name, type, image_data, image_name) VALUES (?, ?, ?, ?)',
      [name, type, image_data, image_name]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD endpoints for stations
app.get('/stations', async (req, res) => {
  try {
    const stations = await query('SELECT * FROM stations ORDER BY name');
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/stations', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await query(
      'INSERT INTO stations (name) VALUES (?)',
      [name]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
