import { Router } from "express";
import {
  crearTurno,
  obtenerTurnos,
  obtenerTurno,
  actualizarTurno,
  eliminarTurno,
  horariosDisponibles,
  horariosOcupados,

} from "../../controllers/turnos/index.js";

export const turnosRouter = Router();

turnosRouter.post("/", crearTurno);
turnosRouter.get("/", obtenerTurnos);

// endpoints de horarios
turnosRouter.get("/horarios/disponibles", horariosDisponibles);
turnosRouter.get("/horarios/ocupados", horariosOcupados);

// rutas con id (siempre al final)
turnosRouter.get("/:id", obtenerTurno);
turnosRouter.put("/:id", actualizarTurno);
turnosRouter.delete("/:id", eliminarTurno);
