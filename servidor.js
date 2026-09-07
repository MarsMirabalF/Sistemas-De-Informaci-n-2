require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool();

app.get('/platos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, puntaje FROM PLATOTIPICO ORDER BY puntaje ASC, id ASC'
    );
    res.json(result.rows);
  } catch (e) {
    res.json({ error: true, mensaje: 'no se pudo cargar la tabla' });
  }
});

app.post('/platos', async (req, res) => {
  try {
    const { nombre, puntaje } = req.body;

    if (!nombre || typeof nombre !== 'string') {
      return res.json({ error: true, mensaje: 'falta el nombre' });
    }

    const puntajeNum = Number(puntaje);

    if (!Number.isInteger(puntajeNum)) {
      return res.json({ error: true, mensaje: 'el puntaje debe ser un numero' });
    }

    const nombreLimpio = nombre.trim();

    const yaExiste = await pool.query(
      'SELECT id FROM PLATOTIPICO WHERE LOWER(nombre) = LOWER($1)',
      [nombreLimpio]
    );

    if (yaExiste.rows.length > 0) {
      return res.json({ error: true, mensaje: 'ese plato ya existe' });
    }

    const result = await pool.query(
      'INSERT INTO PLATOTIPICO (nombre, puntaje) VALUES ($1, $2) RETURNING id, nombre, puntaje',
      [nombreLimpio, puntajeNum]
    );
    res.json({ error: false, mensaje: 'guardado con exito', plato: result.rows[0] });
  } catch (e) {
    res.json({ error: true, mensaje: 'no se pudo guardar' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Holaaa estoy en http://localhost:${PORT}`);
});