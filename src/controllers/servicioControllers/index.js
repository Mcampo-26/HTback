import { Servicio } from "../../models/servicio.js";

// Obtener todos los servicios médicos ordenados alfabéticamente
export const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find().sort({ nombre: 1 });
    return res.json(servicios);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener los servicios médicos", error: error.message });
  }
};

// Dar de alta un servicio dinámico desde el modal
export const crearServicio = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ mensaje: "El nombre es requerido" });

    // Normalización estricta: Primera letra Mayúscula, resto minúscula (Ej: "Odontología")
    const nombreFormateado = nombre.trim().charAt(0).toUpperCase() + nombre.trim().slice(1).toLowerCase();

    const existe = await Servicio.findOne({ nombre: nombreFormateado });
    if (existe) return res.status(400).json({ mensaje: "Este servicio ya se encuentra registrado" });

    const nuevoServicio = new Servicio({ nombre: nombreFormateado });
    await nuevoServicio.save();
    
    return res.status(201).json(nuevoServicio);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al guardar el servicio médico", error: error.message });
  }
};



export const eliminarServicio = async (req, res) => {
    try {
      const { id } = req.params;
  
      const eliminado = await Servicio.findByIdAndDelete(id);
      if (!eliminado) {
        return res.status(404).json({ mensaje: "El servicio no existe o ya fue eliminado" });
      }
  
      return res.json({ mensaje: "Servicio eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({ mensaje: "Error al eliminar el servicio", error: error.message });
    }
  };