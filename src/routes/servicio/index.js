import express from "express";
const router = express.Router();

// 🔄 Importamos las funciones del controlador de servicios subiendo los niveles correctos
import { getServicios, crearServicio ,eliminarServicio} from "../../controllers/servicioControllers/index.js"; 
// 💡 Nota: Si metiste el controlador de servicios adentro de una subcarpeta como hizo Node con los otros, 
// asegurate de que la ruta apunte exactamente ahí (ej: "../../controllers/serviciosControllers/index.js")

// 🛣️ Definimos los Endpoints para Zustand
router.get("/", getServicios);
router.post("/", crearServicio);
router.delete("/:id", eliminarServicio);

export default router;