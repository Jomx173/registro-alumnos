const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===== POSTGRES (Render) =====
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ===== TEST =====
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      hora: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ===== INSERTAR ALUMNO =====
app.post("/alumnos", async (req, res) => {
  try {
    const {
      nombreAlumno,
      identidadAlumno,
      edadAlumno,
      nombrePadre,
      identidadPadre,
      telefonoPadre
    } = req.body;

    await pool.query(
      `INSERT INTO alumno
      (nombre_alumno, identidad_alumno, edad_alumno, nombre_padre, identidad_padre, telefono_padre)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        nombreAlumno,
        identidadAlumno,
        edadAlumno,
        nombrePadre,
        identidadPadre,
        telefonoPadre
      ]
    );

    res.json({ mensaje: "Alumno registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ===== SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
