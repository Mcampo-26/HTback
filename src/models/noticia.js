// src/noticias/noticia.model.js
import mongoose from "mongoose";

const NoticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    imagenUrl: {
      type: String,          // URL o base64
      required: false,
      default: null,
    },
    posicion: {
      type: String,
      enum: ["carrusel", "cards", "banner","participacion", "salud", "banner1", "banner2"],
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },

    link: {
      type: String,
      default: null,
    },
    
  },
  { timestamps: true }
);

export const Noticia = mongoose.model("Noticia", NoticiaSchema);
