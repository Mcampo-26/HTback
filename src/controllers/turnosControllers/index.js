import { Turno } from "../../models/turno.js";
import { Especialista } from "../../models/especialista.js";
import { obtenerSiguienteNumeroTurno } from "../../helpers/counterHelper.js";

// Crear turno
export const crearTurno = async (req, res) => {
  try {
    const { dni, telefono, especialista, fecha, hora } = req.body;

    if (!dni || !telefono || !especialista || !fecha || !hora) {
      return res.status(400).json({ msg: "Faltan datos requeridos." });
    }

    const dniBusqueda = String(dni).trim();
    const fechaBusqueda = String(fecha).trim();

    const turnosExistentes = await Turno.countDocuments({
      dni: dniBusqueda,
      fecha: fechaBusqueda,
      estado: { $ne: "cancelado" }
    });

    if (turnosExistentes >= 3) {
      return res.status(400).json({ 
        msg: "Alcanzaste el máximo de 3 turnos por día para este documento. Intentá mañana." 
      });
    }

    const numeroTurno = await obtenerSiguienteNumeroTurno(fechaBusqueda);

    const nuevoTurno = new Turno({
      dni: dniBusqueda,
      telefono,
      especialista,
      fecha: fechaBusqueda,
      hora,
      numeroTurno
    });

    await nuevoTurno.save();
    return res.status(201).json(nuevoTurno);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ 
        msg: "El horario seleccionado acaba de ser reservado por otro paciente. Por favor, elegí otro horario." 
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Horarios disponibles basados en el ID del especialista
export const horariosDisponibles = async (req, res) => {
  try {
    const { especialista, fecha } = req.query;

    if (!especialista || !fecha)
      return res.status(400).json({ error: "Faltan datos" });

    const profesional = await Especialista.findById(especialista);

    if (!profesional) {
      return res.status(404).json({ error: "El especialista no existe" });
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

    return res.json({ horarios });
  } catch (err) {
    return res.status(500).json({ error: "Error interno" });
  }
};

// Horarios ocupados basados en el ID del especialista
export const horariosOcupados = async (req, res) => {
  try {
    const { especialista, fecha } = req.query;
    
    if (!especialista || !fecha)
      return res.status(400).json({ error: "Faltan datos" });

    const turnosTomados = await Turno.find({ 
      especialista, 
      fecha, 
      estado: "pendiente" 
    });
    
    const horas = turnosTomados.map(t => t.hora);
    return res.json({ horas });
  } catch (err) {
    return res.status(500).json({ error: "Error interno" });
  }
};

// Obtener todos los turnos (Suma populate para ver los datos del Especialista)
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find()
      .populate("especialista", "nombre apellido especialidad") // Trae datos limpios del médico
      .sort({ createdAt: -1 });
    return res.json(turnos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Obtener un turno por ID
export const obtenerTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await Turno.findById(id).populate("especialista", "nombre apellido especialidad");
    if (!turno) return res.status(404).json({ msg: "No encontrado" });
    return res.json(turno);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar turno
export const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const turno = await Turno.findByIdAndUpdate(id, data, { new: true });
    if (!turno) return res.status(404).json({ msg: "No encontrado" });
    return res.json(turno);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ 
        msg: "No se puede actualizar a este horario porque ya fue reservado por otro paciente." 
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar turno (Físico)
export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await Turno.findByIdAndDelete(id);
    if (!turno) return res.status(404).json({ msg: "No encontrado" });
    return res.json({ msg: "Turno eliminado físicamente" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};