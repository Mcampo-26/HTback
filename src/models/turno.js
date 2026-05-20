import mongoose from "mongoose";

const TurnoSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      trim: true, // Limpia espacios accidentales al guardar
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    // 🔄 EVOLUCIÓN: Ya no es un string suelto. Ahora apunta al Especialista real.
    especialista: { // 👈 Este nombre tiene que ser idéntico al del populate
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialista", // Nombre del modelo al que apunta
      required: true
    },
    fecha: {
      type: String, // Mantenemos String ("YYYY-MM-DD") para simplificar el manejo de zonas horarias en el frontend
      required: true,
    },
    hora: {
      type: String, // Mantenemos String ("HH:MM") por consistencia con tus selectores
      required: true,
    },
    numeroTurno: {
      type: Number,
      required: true,
    },
    qr: {
      type: String,
      default: null,
    },
    estado: {
      type: String,
      enum: ["pendiente", "atendido", "cancelado"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

// 🔒 EL BLINDAJE ULTRA-ROBUSTO: Índice Único Compuesto
// Evita físicamente que dos pacientes colisionen en el mismo hueco de la agenda de un médico.
TurnoSchema.index(
  { especialista: 1, fecha: 1, hora: 1, estado: 1 },
  {
    unique: true,
    // Condición mágica: Solo aplica la restricción de unicidad si el turno está "pendiente".
    // Esto permite que si un turno se cancela, ese horario quede liberado para otro paciente.
    partialFilterExpression: { estado: "pendiente" },
  }
);

// 🔍 ÍNDICE OPTIMIZADOR: Para acelerar las búsquedas diarias por DNI
TurnoSchema.index({ dni: 1, fecha: 1 });

export const Turno = mongoose.model("Turno", TurnoSchema);