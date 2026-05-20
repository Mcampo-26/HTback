import mongoose from "mongoose";

const especialistaSchema = new mongoose.Schema(
  {
    nombre: { 
      type: String, 
      required: true 
    },
    // 🔄 REFACTORIZADO: Relación limpia apuntando a la colección Servicio
    especialidad: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Servicio", 
      required: true 
    },
    matricula: { 
      type: String, 
      required: true, 
      unique: true 
    },
    telefono: { type: String }, 
    direccion: { type: String }, 
    email: { type: String }, 
    diasAtencion: [{ type: String }], 
    horariosBase: [{ type: String }]  
  }, 
  { timestamps: true }
);

export const Especialista = mongoose.model("Especialista", especialistaSchema);