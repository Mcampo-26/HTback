// src/controllers/autoridadController.js
import Autoridad from "../../models/autoridad.js";

// 1. OBTENER TODAS LAS AUTORIDADES
export const obtenerAutoridades = async (req, res) => {
  try {
    const { activo } = req.query;
    const filtro = {};

    // Si viene ?activo=true desde el frontend (vista pública), filtramos
    if (activo === "true") {
      filtro.activo = true;
    }

    // Buscamos y ordenamos ascendentemente por el campo 'orden'
    const autoridades = await Autoridad.find(filtro).sort({ orden: 1 });
    
    res.status(200).json(autoridades);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la nómina de autoridades",
      error: error.message,
    });
  }
};

// 2. OBTENER UNA SOLA AUTORIDAD POR ID
export const obtenerAutoridad = async (req, res) => {
  try {
    const { id } = req.params;
    const autoridad = await Autoridad.findById(id);

    if (!autoridad) {
      return res.status(404).json({ mensaje: "Autoridad no encontrada" });
    }

    res.status(200).json(autoridad);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar el miembro del directivo",
      error: error.message,
    });
  }
};

// 3. CREAR NUEVA AUTORIDAD
export const crearAutoridad = async (req, res) => {
  try {
    // El body ya viene sanitizado gracias a tu middleware global
    const nuevaAutoridad = new Autoridad(req.body);
    const autoridadGuardada = await nuevaAutoridad.save();

    res.status(201).json(autoridadGuardada);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al registrar la autoridad",
      error: error.message,
    });
  }
};

// 4. ACTUALIZAR AUTORIDAD
export const actualizarAutoridad = async (req, res) => {
  try {
    const { id } = req.params;

    const autoridadActualizada = await Autoridad.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // new: true devuelve el objeto ya modificado
    );

    if (!autoridadActualizada) {
      return res.status(404).json({ mensaje: "Autoridad no encontrada" });
    }

    res.status(200).json(autoridadActualizada);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar los datos del directivo",
      error: error.message,
    });
  }
};

// 5. ELIMINAR AUTORIDAD
export const eliminarAutoridad = async (req, res) => {
  try {
    const { id } = req.params;
    const autoridadEliminada = await Autoridad.findByIdAndDelete(id);

    if (!autoridadEliminada) {
      return res.status(404).json({ mensaje: "Autoridad no encontrada" });
    }

    res.status(200).json({ mensaje: "Miembro removido de la nómina correctamente" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar la autoridad",
      error: error.message,
    });
  }
};