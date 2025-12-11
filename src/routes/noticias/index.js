// src/noticias/noticias.routes.js
import { Router } from "express";
import {
  crearNoticia,
  obtenerNoticias,
  obtenerNoticia,
  actualizarNoticia,
  eliminarNoticia,
} from "../../controllers/noticiasControllers/index.js";

export const noticiasRouter = Router();

noticiasRouter.post("/", crearNoticia);
noticiasRouter.get("/", obtenerNoticias);

// rutas con id (siempre al final)
noticiasRouter.get("/:id", obtenerNoticia);
noticiasRouter.put("/:id", actualizarNoticia);
noticiasRouter.delete("/:id", eliminarNoticia);
