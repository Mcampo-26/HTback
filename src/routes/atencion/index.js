import { Router } from "express";
import { 
  crearAtencion, 
  obtenerAtenciones, 
  obtenerAtencionesPorDni, 
  eliminarAtencion 
} from "../../controllers/atencionControllers/index.js";

export const atencionesRouter = Router();

atencionesRouter.post("/", crearAtencion);
atencionesRouter.get("/", obtenerAtenciones);
atencionesRouter.get("/paciente/:dni", obtenerAtencionesPorDni); // Buscar historial por DNI
atencionesRouter.delete("/:id", eliminarAtencion);