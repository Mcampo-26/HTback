import { Router } from "express";
import {
  crearAutoridad,
  obtenerAutoridades,
  obtenerAutoridad,
  actualizarAutoridad,
  eliminarAutoridad,
} from "../../controllers/autoridadesControllers/index.js";
// 👇 Importás de forma limpia el validador de sesión que acabamos de estructurar
import { verificarToken } from "../../middleware/auth.js"; 

const router = Router();

// 🔓 Públicos
router.get("/", obtenerAutoridades);
router.get("/:id", obtenerAutoridad);

// 🔐 Protegidos (Nadie va a poder meter mano en tu base de datos si no pasó por el Login)
router.post("/", verificarToken, crearAutoridad);
router.put("/:id", verificarToken, actualizarAutoridad);
router.delete("/:id", verificarToken, actualizarAutoridad);

export default router;