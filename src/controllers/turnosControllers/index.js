import { Turno } from "../../models/turno.js";

const horariosPorEspecialidad = {
  "Traumatólogo":  ["08:00","08:30","09:00","09:30","10:00","10:30"],
  "Odontólogo":    ["08:00","08:30","09:00","09:30","10:00","10:30"],
  "Cardiólogo":   ["08:00","08:30","09:00","09:30","10:00","10:30"],
  "Kinesiólogo":  ["08:00","08:30","09:00","09:30","10:00","10:30"],
};

// Crear turno
export const crearTurno = async (req, res) => {
  try {
    const { dni, telefono, especialidad, fecha, hora } = req.body;

    if (!dni || !telefono || !especialidad || !fecha || !hora) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    // 🔒 Máximo 3 turnos POR DÍA por DNI
    const turnosDelDia = await Turno.countDocuments({
      dni,
      fecha,
      estado: { $ne: "cancelado" } // opcional si no usás estado
    });

    if (turnosDelDia >= 3) {
      return res.status(400).json({
        msg: "Alcanzaste el máximo de 3 turnos por día. Intentá mañana."
      });
    }

    // 🔢 Número de turno
    const ultimo = await Turno.findOne().sort({ numeroTurno: -1 });
    const numeroTurno = ultimo ? ultimo.numeroTurno + 1 : 1;

    const turno = await Turno.create({
      dni,
      telefono,
      especialidad,
      fecha,
      hora,
      numeroTurno
    });

    return res.status(201).json(turno);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const horariosDisponibles = async (req, res) => {
  try {
    const { especialidad, fecha } = req.query;

    if (!especialidad || !fecha)
      return res.status(400).json({ error: "Faltan datos" });

    const base = horariosPorEspecialidad[especialidad] || [];

    const turnosTomados = await Turno.find({ especialidad, fecha });
    const ocupados = turnosTomados.map(t => t.hora);

    const horarios = base.map(h => ({
      hora: h,
      disponible: !ocupados.includes(h)
    }));

    res.json({ horarios });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error interno" });
  }
};


// Obtener todos
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find().sort({ createdAt: -1 });
    return res.json(turnos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Obtener uno por ID
export const obtenerTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await Turno.findById(id);
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
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar turno
export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await Turno.findByIdAndDelete(id);
    if (!turno) return res.status(404).json({ msg: "No encontrado" });
    return res.json({ msg: "Turno eliminado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Horarios disponibles


// Horarios ocupados
export const horariosOcupados = async (req, res) => {
  try {
    const { especialidad, fecha } = req.query;
    const turnosTomados = await Turno.find({ especialidad, fecha });
    const horas = turnosTomados.map(t => t.hora);
    res.json({ horas });
  } catch (err) {
    res.status(500).json({ error: "Error interno" });
  }
};