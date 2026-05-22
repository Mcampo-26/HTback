import mongoose from "mongoose";

const TurnoSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    especialista: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialista", 
      required: true
    },
    fecha: {
      type: String, 
      required: true,
    },
    hora: {
      type: String, 
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

TurnoSchema.index(
  { especialista: 1, fecha: 1, hora: 1, estado: 1 },
  {
    unique: true,
    partialFilterExpression: { estado: "pendiente" },
  }
);

TurnoSchema.index({ dni: 1, fecha: 1 });

export const Turno = mongoose.model("Turno", TurnoSchema);