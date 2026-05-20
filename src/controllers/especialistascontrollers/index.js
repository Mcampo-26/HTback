import { Especialista } from "../../models/especialista.js";




// Obtener staff médico completo con el Servicio cruzado
export const getEspecialistas = async (req, res) => {
  try {
    // 🔄 Cambia el string de adentro por el nombre exacto de la propiedad en tu Schema de Especialista
    const lista = await Especialista.find()
      .populate("especialidad") // 👈 Asegurate que coincida con el campo de tu modelo
      .sort({ nombre: 1 });

    return res.json(lista);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

// Crear especialista vinculando su ID de Servicio correspondiente
export const crearEspecialista = async (req, res) => {
  try {
    const nuevo = new Especialista(req.body);
    await nuevo.save();
    
    const registrado = await Especialista.findById(nuevo._id).populate("especialidad");
    return res.status(201).json(registrado);
  } catch (error) {
    return res.status(400).json({ mensaje: "Error al crear", error: error.message });
  }
};

// Actualizar especialista
export const actualizarEspecialista = async (req, res) => {
  try {
    const actualizado = await Especialista.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true } 
    ).populate("especialidad");
    
    if (!actualizado) return res.status(404).json({ mensaje: "No encontrado" });
    
    return res.json(actualizado);
  } catch (error) {
    return res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
  }
};

// Eliminar especialista
export const eliminarEspecialista = async (req, res) => {
  try {
    await Especialista.findByIdAndDelete(req.params.id);
    return res.json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar" });
  }
};