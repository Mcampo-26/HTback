import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// 🟡 1. EL FRENO: Ralentiza al usuario si hace clics repetidos muy rápido
export const turnosSlowDown = slowDown({
  windowMs: 30 * 1000, // Ventana de 30 segundos
  delayAfter: 5,       // Permite 5 peticiones libres...
  delayMs: (hits) => hits * 500, // ...a partir de la 6ta, añade 500ms de retraso por cada clic extra
  maxDelayMs: 3000     // El retraso máximo será de 3 segundos para no congelar el servidor
});

// 🔴 2. EL CANDADO: Bloquea por completo si excede el límite crítico de abuso
export const turnosRateLimit = rateLimit({
  windowMs: 30 * 1000, // Ventana de 30 segundos
  max: 15,             // Máximo 15 peticiones por IP en esa ventana
  standardHeaders: true, // Devuelve información de límite en las cabeceras HTTP (RateLimit-*)
  legacyHeaders: false,  // Desactiva las cabeceras antiguas (X-RateLimit-*)
  message: {
    msg: "Detectamos demasiadas solicitudes seguidas. Por favor, espere 30 segundos antes de intentar reservar otro turno."
  }
});