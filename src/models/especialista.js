import mongoose from "mongoose";

const especialistaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    telefono: { type: String }, // Nuevo
    direccion: { type: String }, // Nuevo
    email: { type: String }, // Nuevo
    diasAtencion: [{ type: String }], 
    horariosBase: [{ type: String }]  
  }, { timestamps: true });

export const Especialista = mongoose.model("Especialista", especialistaSchema);