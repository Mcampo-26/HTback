import { Especialista } from "../../models/especialista.js";

export const getEspecialistas = async (req, res) => {
  try {
    const lista = await Especialista.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const crearEspecialista = async (req, res) => {
  try {
    const nuevo = new Especialista(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear", error: error.message });
  }
};
export const actualizarEspecialista = async (req, res) => {
  try {
    // Usamos req.body directamente para que tome todos los campos del modelo
    const actualizado = await Especialista.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, // Forzamos el set de los campos enviados
      { new: true, runValidators: true } 
    );
    
    if (!actualizado) return res.status(404).json({ mensaje: "No encontrado" });
    
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
  }
};

export const eliminarEspecialista = async (req, res) => {
  try {
    await Especialista.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar" });
  }
};