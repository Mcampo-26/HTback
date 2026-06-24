// src/models/Autoridad.js
import mongoose from "mongoose";

const AutoridadSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El nombre completo es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "El cargo sindical es obligatorio"],
      trim: true,
    },
    imagenUrl: {
      type: String,
      default: "",
    },
    orden: {
      type: Number,
      default: 0, // Te permite ordenar: 1 para Secretario General, 2 para Adjunto, etc.
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Nos crea automáticamente createdAt y updatedAt
    versionKey: false, // Quita el __v de los registros de MongoDB
  }
);

// Aplicamos el sanitizer por si llega a quedar algún residuo en consultas complejas
AutoridadSchema.post("validate", function (doc) {
  if (doc.titulo) doc.titulo = doc.titulo.trim();
  if (doc.descripcion) doc.descripcion = doc.descripcion.trim();
});

export default mongoose.model("Autoridad", AutoridadSchema);