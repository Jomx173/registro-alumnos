const express = require("express");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const path = require("path");

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ========== CONFIG SQL (WINDOWS AUTH REAL) ==========
const dbConfig = {
  server: "DESKTOP-88S1VE0\\MSSQLSERVER01",
  database: "RegistroAlumnos",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
};

// ========== TEST SQL ==========
app.get("/test-sql", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    res.send("✅ CONECTADO CORRECTAMENTE A SQL SERVER (Windows Auth)");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error SQL: " + err.message);
  }
});

// ========== INSERTAR ALUMNO ==========
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

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("nombreAlumno", sql.VarChar, nombreAlumno)
      .input("identidadAlumno", sql.VarChar, identidadAlumno)
      .input("edadAlumno", sql.Int, edadAlumno)
      .input("nombrePadre", sql.VarChar, nombrePadre)
      .input("identidadPadre", sql.VarChar, identidadPadre)
      .input("telefonoPadre", sql.VarChar, telefonoPadre)
      .query(`
        INSERT INTO Alumno
        (NombreAlumno, IdentidadAlumno, EdadAlumno, NombrePadre, IdentidadPadre, TelefonoPadre)
        VALUES
        (@nombreAlumno, @identidadAlumno, @edadAlumno, @nombrePadre, @identidadPadre, @telefonoPadre)
      `);

    res.json({ mensaje: "Alumno registrado correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== SERVER ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
