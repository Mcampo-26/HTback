import mongoose from "mongoose";

const AtencionSchema = new mongoose.Schema(
  {
    pacienteDni: { type: String, required: true, trim: true },
    medicoNombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    presion: { type: String, required: true },
    saturacion: { type: String, required: true },
    temperatura: { type: String, required: true },
    frecuenciaCardiaca: { type: String, required: true },
    motivoConsulta: { type: String, required: true },
    alergias: { type: String, default: "No" },
    alergiasDetalle: { type: String, default: null },
    descripcion: { type: String, required: true }, 
    diagnostico: { type: String, required: true },
    tratamiento: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Atencion = mongoose.model("Atencion", AtencionSchema);