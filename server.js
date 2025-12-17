const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* ================= CONFIG SQL SERVER (RENDER) =================
   ESTO USA VARIABLES DE ENTORNO
*/
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,   // ej: myserver.database.windows.net
  database: process.env.DB_NAME,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

/* ================= TEST CONEXIÓN ================= */
app.get("/test-sql", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    res.send("✅ Conectado correctamente a SQL Server (Render)");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error SQL: " + err.message);
  }
});

/* ================= INSERTAR ALUMNO ================= */
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
      .input("NombreAlumno", sql.VarChar, nombreAlumno)
      .input("IdentidadAlumno", sql.VarChar, identidadAlumno)
      .input("EdadAlumno", sql.Int, edadAlumno)
      .input("NombrePadre", sql.VarChar, nombrePadre)
      .input("IdentidadPadre", sql.VarChar, identidadPadre)
      .input("TelefonoPadre", sql.VarChar, telefonoPadre)
      .query(`
        INSERT INTO Alumno
        (NombreAlumno, IdentidadAlumno, EdadAlumno, NombrePadre, IdentidadPadre, TelefonoPadre)
        VALUES
        (@NombreAlumno, @IdentidadAlumno, @EdadAlumno, @NombrePadre, @IdentidadPadre, @TelefonoPadre)
      `);

    res.json({ mensaje: "Alumno registrado correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
