// src/turnos/turnos.model.js
import mongoose from "mongoose";

const TurnoSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    especialidad: {
      type: String,
      required: true,
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
      type: String, // acá después ponemos el base64
      default: null,
    },

  },
  { timestamps: true }
);

export const Turno = mongoose.model("Turno", TurnoSchema);
