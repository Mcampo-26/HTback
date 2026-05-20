import mongoose from "mongoose";

const ServicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Servicio = mongoose.model("Servicio", ServicioSchema);