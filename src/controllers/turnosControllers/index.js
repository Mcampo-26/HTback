import { Turno } from "../../models/turno.js";
import { Especialista } from "../../models/especialista.js";
import { obtenerSiguienteNumeroTurno } from "../../helpers/counterHelper.js";

// =========================================================================
// 1. CREAR TURNO (CON CANDADO TOTAL DE 3 TURNOS POR DNI)
// =========================================================================
export const crearTurno = async (req, res) => {
  try {
    const { dni, telefono, especialista, fecha, hora } = req.body;

    const dniLimpio = String(dni).trim();
    const fechaLimpia = String(fecha).trim();

    // 🧪 LOG 1: Ver qué datos exactos entran desde el frontend
    console.log(`\n[CAZA-ERROR] Entrando DNI: "${dniLimpio}" (Tipo: ${typeof dniLimpio}) | Fecha: "${fechaLimpia}" (Tipo: ${typeof fechaLimpia})`);

    // Hacemos el conteo directo
    const turnosExistentes = await Turno.countDocuments({
      dni: dniLimpio,
      fecha: fechaLimpia,
      estado: { $not: { $eq: "cancelado" } }
    });

    // 🧪 LOG 2: Ver cuánto da la cuenta de Mongo antes de tirar el IF
    console.log(`[CAZA-ERROR] Cantidad de turnos encontrados en BD para hoy: ${turnosExistentes}`);

    if (turnosExistentes >= 3) {
      console.log(`[CAZA-ERROR] 🛑 BLOQUEADO: El DNI ${dniLimpio} ya tiene ${turnosExistentes} turnos.`);
      return res.status(400).json({ 
        success: false,
        msg: "Alcanzaste el máximo de 3 turnos permitidos para este día. Intentá con otra fecha." 
      });
    }

    console.log(`[CAZA-ERROR] ✅ PERMITIDO: Pasando a generar número de ticket...`);

    const numeroTurno = await obtenerSiguienteNumeroTurno();

    const nuevoTurno = new Turno({
      dni: dniLimpio,
      telefono: String(telefono).trim(),
      especialista,
      fecha: fechaLimpia,
      hora,
      numeroTurno,
      estado: "pendiente"
    });

    await nuevoTurno.save();
    
    return res.status(201).json({
      success: true,
      data: nuevoTurno
    });

  } catch (err) {
    console.error("[ERROR CRÍTICO TURNOS]:", err.message);
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false,
        msg: "El horario seleccionado acaba de ser reservado por otro paciente. Por favor, elegí otro horario." 
      });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

// =========================================================================
// 2. ACTUALIZAR TURNO (CON RESPUESTA ESTRUCTURADA)
// =========================================================================
export const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const dataFiltrada = req.body; 
    
    const turnoModificado = await Turno.findByIdAndUpdate(id, dataFiltrada, { new: true });
    if (!turnoModificado) return res.status(404).json({ success: false, msg: "No encontrado" });
    
    return res.json({
      success: true,
      data: turnoModificado
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false,
        msg: "No se puede actualizar a este horario porque ya fue reservado por otro paciente." 
      });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

// =========================================================================
// 3. HORARIOS DISPONIBLES
// =========================================================================
export const horariosDisponibles = async (req, res) => {
  try {
    const { especialista, fecha } = req.query;

    if (!especialista || !fecha)
      return res.status(400).json({ success: false, error: "Faltan datos" });

    const profesional = await Especialista.findById(especialista);
    if (!profesional) {
      return res.status(404).json({ success: false, error: "El especialista no existe" });
    }

    const base = profesional.horariosBase || [];
    const turnosTomados = await Turno.find({ 
      especialista, 
      fecha, 
      estado: "pendiente" 
    });
    
    const ocupados = turnosTomados.map(t => t.hora);

    const horarios = base.map(h => ({
      hora: h,
      disponible: !ocupados.includes(h)
    }));

    return res.json({ success: true, horarios });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
};

// =========================================================================
// 4. HORARIOS OCUPADOS
// =========================================================================
export const horariosOcupados = async (req, res) => {
  try {
    const { especialista, fecha } = req.query;
    
    if (!especialista || !fecha)
      return res.status(400).json({ success: false, error: "Faltan datos" });

    const turnosTomados = await Turno.find({ 
      especialista, 
      fecha, 
      estado: "pendiente" 
    });
    
    const horas = turnosTomados.map(t => t.hora);
    return res.json({ success: true, horas });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
};

// =========================================================================
// 5. OBTENER TODOS LOS TURNOS
// =========================================================================
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find()
      .populate("especialista", "nombre apellido especialidad") 
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: turnos });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// =========================================================================
// 6. OBTENER UN TURNO POR ID
// =========================================================================
export const obtenerTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Turno.findById(id).populate("especialista", "nombre apellido especialidad");
    if (!result) return res.status(404).json({ success: false, msg: "No encontrado" });
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// =========================================================================
// 7. ELIMINAR TURNO (FÍSICO)
// =========================================================================
export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Turno.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, msg: "No encontrado" });
    return res.json({ success: true, msg: "Turno eliminado físicamente" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};