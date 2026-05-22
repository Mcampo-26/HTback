import { Router } from "express";
import {
  crearTurno,
  obtenerTurnos,
  obtenerTurno,
  actualizarTurno,
  eliminarTurno,
  horariosDisponibles,
  horariosOcupados,
} from "../../controllers/turnosControllers/index.js";

import { validateBody } from "../../middleware/validate.js";
import { crearTurnoSchema, actualizarTurnoSchema } from "../../models/turnoValidation.js";

// 🛠️ NUEVO IMPORT: Traemos los controladores de abuso
import { turnosRateLimit, turnosSlowDown } from "../../middleware/rateLimiter.js";

export const turnosRouter = Router();

// 🔥 TRIPLE CAPA PERIMETRAL: Freno por velocidad -> Candado por abuso -> Validación de datos -> Controlador
turnosRouter.post(
  "/", 
  turnosSlowDown, 
  turnosRateLimit, 
  validateBody(crearTurnoSchema), 
  crearTurno
);

turnosRouter.get("/", obtenerTurnos);
turnosRouter.get("/horarios/disponibles", horariosDisponibles);
turnosRouter.get("/horarios/ocupados", horariosOcupados);
turnosRouter.get("/:id", obtenerTurno);
turnosRouter.put("/:id", validateBody(actualizarTurnoSchema), actualizarTurno);
turnosRouter.delete("/:id", eliminarTurno);