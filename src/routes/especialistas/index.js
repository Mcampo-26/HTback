import { Router } from "express";
import { 
  getEspecialistas, 
  crearEspecialista, 
  actualizarEspecialista, // Corregido el nombre
  eliminarEspecialista 
} from "../../controllers/especialistascontrollers/index.js";

// Exportamos como especialistasRouter
export const especialistasRouter = Router();

// --- RUTAS ---

// Obtener todos los médicos
especialistasRouter.get("/", getEspecialistas);

// Crear un nuevo médico
especialistasRouter.post("/", crearEspecialista);

// Actualizar un médico existente (Se usa PUT y se requiere el ID)
especialistasRouter.put("/:id", actualizarEspecialista); 

// Eliminar un médico (Se requiere el ID)
especialistasRouter.delete("/:id", eliminarEspecialista);