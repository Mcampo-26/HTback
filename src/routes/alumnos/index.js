import { Router } from "express";
import {
  obtenerAlumnosDashboard,
  obtenerFichaAcademica,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno,
  guardarNotaMoodle,
} from "../../controllers/alumnosControllers/index.js";


const router = Router();

// 🔓 Públicos (Consultas de listado y lo que viene de Moodle)
router.get("/", obtenerAlumnosDashboard);
router.get("/:id/academico", obtenerFichaAcademica);

// 🔐 Protegidos (CRUD Real de alumnos administrados en tu app)
router.post("/",  crearAlumno);
router.put("/:id",  actualizarAlumno);
router.delete("/:id",  eliminarAlumno);

// 🔐 Notas de Moodle protegidas para que solo bedeles/profesores editen


export default router;