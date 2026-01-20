import mongoose from "mongoose";

const especialistaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    // Guardamos la configuración personalizada de cada médico
    diasAtencion: [{ type: String }], // Ejemplo: ["Lunes", "Miércoles"]
    horariosBase: [{ type: String }]  // Ejemplo: ["08:00", "08:30", "09:00"]
  }, { timestamps: true });

// Exportación nombrada con "E" mayúscula
export const Especialista = mongoose.model("Especialista", especialistaSchema);