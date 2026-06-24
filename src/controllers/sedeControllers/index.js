// src/controllers/sede.controller.js
import { Sede } from "../../models/sede.js";

export const crearSede = async (req, res) => {
  try {
    const { titulo, direccion, encargados, telefono, horario, mapsUrl, imagenUrl, activo } = req.body;

    if (!titulo || !direccion || !encargados || !telefono) {
      return res.status(400).json({ mensaje: "Título, dirección, encargados y teléfono son obligatorios" });
    }

    const nuevaSede = new Sede({
      titulo,
      direccion,
      encargados,
      telefono,
      horario: horario || "Lunes a Viernes de 08:00 a 16:00 hs",
      mapsUrl: mapsUrl || null,
      imagenUrl: imagenUrl || null,
      activo: activo !== undefined ? activo : true,
    });

    const sedeGuardada = await nuevaSede.save();
    return res.status(201).json(sedeGuardada);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear la sede", error: error.message });
  }
};

export const obtenerSedes = async (req, res) => {
  try {
    const { activo } = req.query;
    const filtros = {};
    if (activo !== undefined) filtros.activo = activo === "true";

    const sedes = await Sede.find(filtros).sort({ titulo: 1 }); // Ordenadas alfabéticamente
    return res.status(200).json(sedes);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener sedes", error: error.message });
  }
};

export const obtenerSede = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = await Sede.findById(id);
    if (!sede) return res.status(404).json({ mensaje: "Sede no encontrada" });
    return res.status(200).json(sede);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener la sede", error: error.message });
  }
};

export const actualizarSede = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const sedeActualizada = await Sede.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!sedeActualizada) return res.status(404).json({ mensaje: "Sede no encontrada" });
    return res.status(200).json(sedeActualizada);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar la sede", error: error.message });
  }
};

export const eliminarSede = async (req, res) => {
  try {
    const { id } = req.params;
    const sedeEliminada = await Sede.findByIdAndDelete(id);
    if (!sedeEliminada) return res.status(404).json({ mensaje: "Sede no encontrada" });
    return res.status(200).json({ mensaje: "Sede eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar la sede", error: error.message });
  }
};   