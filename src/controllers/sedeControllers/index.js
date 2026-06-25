// controllers/sedeControllers/index.js
import { Sede } from "../../models/sede.js";

// 1️⃣ CREAR ESTABLECIMIENTO (Sede o Hotel)
export const crearSede = async (req, res) => {
  try {
    const { titulo, tipo, direccion, encargados, telefono, horario, mapsUrl, imagenUrl, activo } = req.body;

    if (!titulo || !tipo || !direccion || !encargados || !telefono) {
      return res.status(400).json({ 
        mensaje: "Título, tipo (sede/hotel), dirección, encargados y teléfono son obligatorios" 
      });
    }

    if (tipo !== "sede" && tipo !== "hotel") {
      return res.status(400).json({ mensaje: "El tipo debe ser estrictamente 'sede' o 'hotel'" });
    }

    const nuevaSede = new Sede({
      titulo,
      tipo, 
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
    return res.status(500).json({ mensaje: "Error al crear el establecimiento", error: error.message });
  }
};

// 2️⃣ OBTENER CON FILTRADO Y MIGRACIÓN AUTOMÁTICA
export const obtenerSedes = async (req, res) => {
  try {
    const { tipo } = req.query;

    // 🔄 REPARACIÓN INSTANTÁNEA EN ATLAS:
    // Le inyectamos el campo tipo a tus 3 registros viejos de forma directa si no lo tienen
    await Sede.updateMany({ tipo: { $exists: false } }, { $set: { tipo: "sede" } });
    await Sede.updateMany({ titulo: { $regex: "Hotel", $options: "i" } }, { $set: { tipo: "hotel" } });

    const filtro = {};
    if (tipo) {
      filtro.tipo = tipo;
    }

    const sedes = await Sede.find(filtro).sort({ createdAt: -1 });
    return res.status(200).json(sedes);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener los registros", error: error.message });
  }
};

// 3️⃣ OBTENER UN SOLO REGISTRO POR ID
export const obtenerSede = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = await Sede.findById(id);
    if (!sede) return res.status(404).json({ mensaje: "Establecimiento no encontrado" });
    return res.status(200).json(sede);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener el registro", error: error.message });
  }
};



export const actualizarSede = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 🔍 LOG 1: Ver qué datos exactos están llegando desde el Modal del Frontend
    console.log("=== ENTRADA EN ACTUALIZAR SEDE ===");
    console.log("ID recibido:", id);
    console.log("Body recibido (req.body):", req.body);

    const updateData = { ...req.body };

    if (updateData.tipo !== undefined && updateData.tipo !== "sede" && updateData.tipo !== "hotel") {
      console.log("🚨 BLOQUEO: El tipo enviado no coincide con 'sede' o 'hotel':", updateData.tipo);
      return res.status(400).json({ 
        mensaje: "El tipo de establecimiento debe ser estrictamente 'sede' o 'hotel'" 
      });
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // 🔍 LOG 2: Ver qué datos le vamos a mandar finalmente a MongoDB
    console.log("Datos limpios que se enviarán a FindByIdAndUpdate:", updateData);

    const sedeActualizada = await Sede.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } 
    );

    // 🔍 LOG 3: Ver qué devolvió la base de datos tras actualizar
    console.log("Registro devuelto por MongoDB despues de actualizar:", sedeActualizada);
    console.log("=================================");

    if (!sedeActualizada) {
      return res.status(404).json({ mensaje: "Establecimiento no encontrado" });
    }
    
    return res.status(200).json(sedeActualizada);
  } catch (error) {
    console.error("🚨 ERROR EN ACTUALIZAR SEDE:", error.message);
    return res.status(500).json({ mensaje: "Error al actualizar", error: error.message });
  }
};

// 5️⃣ ELIMINAR REGISTRO
export const eliminarSede = async (req, res) => {
  try {
    const { id } = req.params;
    const sedeEliminada = await Sede.findByIdAndDelete(id);
    if (!sedeEliminada) return res.status(404).json({ mensaje: "Registro no encontrado" });
    return res.status(200).json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};