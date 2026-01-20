import { Router } from "express";
import { 
  getEspecialistas, 
  crearEspecialista, 
  eliminarEspecialista 
} from "../../controllers/especialistascontrollers/index.js";

// Exportamos como especialistasRouter (con 's' y Router)
export const especialistasRouter = Router();

especialistasRouter.get("/", getEspecialistas);
especialistasRouter.post("/", crearEspecialista);
especialistasRouter.delete("/:id", eliminarEspecialista);