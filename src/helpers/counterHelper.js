// src/helpers/counterHelper.js
import { Counter } from "../models/counter.js";

export const obtenerSiguienteNumeroTurno = async () => {
  // 🍏 CANDADO ABSOLUTO: Clave estática para tener una única fila perpetua en Atlas
  const idEstatico = "contador-global-hospital";

  const contadorActualizado = await Counter.findOneAndUpdate(
    { idConteo: idEstatico },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return contadorActualizado.seq;
};