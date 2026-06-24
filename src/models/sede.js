// src/models/sede.js
import mongoose from "mongoose";

const SedeSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
    },
    encargados: {
      type: String, // Permite poner "Juan Pérez y Marta Gómez"
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    horario: {
      type: String,
      default: "Lunes a Viernes de 08:00 a 16:00 hs",
      trim: true,
    },
    mapsUrl: {
      type: String,
      default: null,
      trim: true,
    },
    imagenUrl: {
      type: String, // URL o Base64
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Sede = mongoose.model("Sede", SedeSchema);