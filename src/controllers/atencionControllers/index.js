import { Atencion } from "../../models/atencion.js";

export const crearAtencion = async (req, res) => {
  try {
    const nuevaAtencion = new Atencion(req.body);
    const guardada = await nuevaAtencion.save();
    return res.status(201).json(guardada);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear la atención", error: error.message });
  }
};

// ✅ ESTA FUNCIÓN PERMITE VER TODAS LAS FECHAS DE UN MISMO PACIENTE
export const obtenerAtencionesPorDni = async (req, res) => {
    try {
      const { dni } = req.params;
      // Buscamos TODOS los registros de ese DNI sin límite
      const historial = await Atencion.find({ pacienteDni: dni }).sort({ createdAt: -1 });
      
      // Si no hay, devolvemos array vacío pero con status 200 para no romper el front
      return res.status(200).json(historial || []);
    } catch (error) {
      return res.status(500).json({ mensaje: "Error al obtener historial", error: error.message });
    }
  };

export const obtenerAtenciones = async (req, res) => {
  try {
    const atenciones = await Atencion.find().sort({ createdAt: -1 });
    return res.status(200).json(atenciones);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener atenciones", error: error.message });
  }
};

export const eliminarAtencion = async (req, res) => {
  try {
    const { id } = req.params;
    await Atencion.findByIdAndDelete(id);
    return res.status(200).json({ mensaje: "Atención eliminada" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error", error: error.message });
  }
};