import { Counter } from "../models/counter.js";

export const obtenerSiguienteNumeroTurno = async (fecha) => {
  const idDinamico = `turnos-${fecha.trim()}`;

  const contadorActualizado = await Counter.findOneAndUpdate(
    { idConteo: idDinamico },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return contadorActualizado.seq;
};