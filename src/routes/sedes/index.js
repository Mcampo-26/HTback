// src/routes/sede.routes.js
import { Router } from "express";
import {
  crearSede,
  obtenerSedes,
  obtenerSede,
  actualizarSede,
  eliminarSede,
} from "../../controllers/sedeControllers/index.js";

const router = Router();

// ✅ USÁ "/" AL PRINCIPIO. Express lo une con el "/api/sedes" del index.js
router.post("/", crearSede);       // Esto responde a: POST http://localhost:8080/api/sedes
router.get("/", obtenerSedes);     // Esto responde a: GET http://localhost:8080/api/sedes
router.get("/:id", obtenerSede);
router.put("/:id", actualizarSede);
router.delete("/:id", eliminarSede);

export default router;