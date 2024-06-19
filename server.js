const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'backend',
  password: 'superpassword',
  database: 'dwm_3'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    throw err;
  }
  console.log('MySQL connected...');
});

// Ruta para obtener todos los activos
app.get('/api/activos', (req, res) => {
  const query = 'SELECT * FROM activos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching activos:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo activo
app.post('/api/activos', (req, res) => {
  console.log('Crear Activo:', req.body);
  const nuevoActivo = req.body;
  const query = 'INSERT INTO activos SET ?';
  db.query(query, nuevoActivo, (err, result) => {
    if (err) {
      console.error('Error creating activo:', err);
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId, ...nuevoActivo });
  });
});

// Ruta para actualizar un activo existente
app.put('/api/activos/:id', (req, res) => {
  console.log('Guardar Edición:', req.body);
  const { id } = req.params;
  const actualizacionActivo = req.body;
  const query = 'UPDATE activos SET ? WHERE id = ?';
  db.query(query, [actualizacionActivo, id], (err, result) => {
    if (err) {
      console.error('Error saving edited activo:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ id, ...actualizacionActivo });
  });
});

// Ruta para eliminar un activo
app.delete('/api/activos/:id', (req, res) => {
  console.log('Eliminar Activo:', req.params.id);
  const { id } = req.params;
  const query = 'DELETE FROM activos WHERE id = ?';
  db.query(query, id, (err, result) => {
    if (err) {
      console.error('Error deleting activo:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ message: 'Activo eliminado' });
  });
});

// Rutas para ubicaciones

app.get('/api/ubicaciones', (req, res) => {
  const query = 'SELECT * FROM ubicaciones';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching ubicaciones:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/api/ubicaciones', (req, res) => {
  console.log('Crear Ubicación:', req.body);
  const nuevaUbicacion = req.body;
  const query = 'INSERT INTO ubicaciones SET ?';
  db.query(query, nuevaUbicacion, (err, result) => {
    if (err) {
      console.error('Error creating ubicación:', err);
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId, ...nuevaUbicacion });
  });
});

app.put('/api/ubicaciones/:id', (req, res) => {
  console.log('Guardar Edición Ubicación:', req.body);
  const { id } = req.params;
  const actualizacionUbicacion = req.body;
  const query = 'UPDATE ubicaciones SET ? WHERE id = ?';
  db.query(query, [actualizacionUbicacion, id], (err, result) => {
    if (err) {
      console.error('Error saving edited ubicación:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ id, ...actualizacionUbicacion });
  });
});

app.delete('/api/ubicaciones/:id', (req, res) => {
  console.log('Eliminar Ubicación:', req.params.id);
  const { id } = req.params;
  const query = 'DELETE FROM ubicaciones WHERE id = ?';
  db.query(query, id, (err, result) => {
    if (err) {
      console.error('Error deleting ubicación:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ message: 'Ubicación eliminada' });
  });
});

// Rutas para responsables

app.get('/api/responsables', (req, res) => {
  const query = 'SELECT * FROM responsables';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching responsables:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/api/responsables', (req, res) => {
  console.log('Crear Responsable:', req.body);
  const nuevoResponsable = req.body;

  // Verificar que todos los campos requeridos están presentes
  if (!nuevoResponsable.numeroEmpleado || !nuevoResponsable.nombre || !nuevoResponsable.imagen) {
    return res.status(400).send({ error: 'Todos los campos son requeridos' });
  }

  const query = 'INSERT INTO responsables (numeroEmpleado, nombre, imagen) VALUES (?, ?, ?)';
  db.query(query, [nuevoResponsable.numeroEmpleado, nuevoResponsable.nombre, nuevoResponsable.imagen], (err, result) => {
    if (err) {
      console.error('Error creating responsable:', err.sqlMessage);
      return res.status(500).send({ error: err.sqlMessage });
    }
    res.status(201).json({ id: result.insertId, ...nuevoResponsable });
  });
});

app.put('/api/responsables/:id', (req, res) => {
  console.log('Guardar Edición Responsable:', req.body);
  const { id } = req.params;
  const actualizacionResponsable = req.body;
  const query = 'UPDATE responsables SET ? WHERE id = ?';
  db.query(query, [actualizacionResponsable, id], (err, result) => {
    if (err) {
      console.error('Error saving edited responsable:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ id, ...actualizacionResponsable });
  });
});

app.delete('/api/responsables/:id', (req, res) => {
  console.log('Eliminar Responsable:', req.params.id);
  const { id } = req.params;
  const query = 'DELETE FROM responsables WHERE id = ?';
  db.query(query, id, (err, result) => {
    if (err) {
      console.error('Error deleting responsable:', err);
      return res.status(500).send(err);
    }
    res.status(200).json({ message: 'Responsable eliminado' });
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
