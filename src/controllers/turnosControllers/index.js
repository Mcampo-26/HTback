import { Turno } from "../../models/turno.js";
import { Especialista } from "../../models/especialista.js";

// Crear turno
export const crearTurno = async (req, res) => {
  try {
    const { dni, telefono, especialidad, fecha, hora } = req.body;

    // Normalizamos para evitar errores de espacios o tipos de datos
    const dniBusqueda = String(dni).trim();
    const fechaBusqueda = String(fecha).trim();

    // 🔒 LA CLAVE: Buscamos coincidencia exacta en la BD
    const turnosExistentes = await Turno.find({
      dni: dniBusqueda,
      fecha: fechaBusqueda,
      estado: { $ne: "cancelado" }
    });

    // LOG para que mires tu consola de Node y veas qué está pasando
    console.log(`DNI: ${dniBusqueda} | Fecha: ${fechaBusqueda} | Encontrados: ${turnosExistentes.length}`);

    if (turnosExistentes.length >= 3) {
      return res.status(400).json({ 
        msg: "Alcanzaste el máximo de 3 turnos por día. Intentá mañana." 
      });
    }

    // Si pasó, seguimos...
    const ultimo = await Turno.findOne().sort({ numeroTurno: -1 });
    const numeroTurno = ultimo ? ultimo.numeroTurno + 1 : 1;

    const nuevoTurno = new Turno({
      dni: dniBusqueda,
      telefono,
      especialidad,
      fecha: fechaBusqueda,
      hora,
      numeroTurno
    });

    await nuevoTurno.save();
    return res.status(201).json(nuevoTurno);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const horariosDisponibles = async (req, res) => {
  try {
    const { especialidad, fecha } = req.query;

    if (!especialidad || !fecha)
      return res.status(400).json({ error: "Faltan datos" });

    // 🔍 BUSQUEDA ROBUSTA:
    // $regex: crea una expresión regular con el nombre
    // $options: "i" hace que ignore mayúsculas y minúsculas
    const profesional = await Especialista.findOne({ 
      especialidad: { $regex: new RegExp(`^${especialidad.trim()}$`, "i") } 
    });

    if (!profesional) {
      return res.status(404).json({ error: "No hay especialistas para esta área" });
    }

    // El resto del código se mantiene igual...
    const base = profesional.horariosBase || [];
    const turnosTomados = await Turno.find({ especialidad, fecha });
    const ocupados = turnosTomados.map(t => t.hora);

    const horarios = base.map(h => ({
      hora: h,
      disponible: !ocupados.includes(h)
    }));

    res.json({ horarios });
  } catch (err) {
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