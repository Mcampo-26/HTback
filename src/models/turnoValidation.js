import Joi from 'joi';

// Expresiones regulares para validaciones estrictas de formatos
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
const horaRegex = /^\d{2}:\d{2}$/;

// 🟢 Esquema para la CREACIÓN de un Turno
export const crearTurnoSchema = Joi.object({
  dni: Joi.string()
    .trim()
    .pattern(/^[0-9]+$/)
    .min(7)
    .max(9)
    .required()
    .messages({
      'string.empty': 'El DNI es obligatorio.',
      'string.pattern.base': 'El DNI debe contener solo números.',
      'string.min': 'El DNI debe tener al menos 7 dígitos.',
      'string.max': 'El DNI no puede superar los 9 dígitos.',
      'any.required': 'El DNI es un campo requerido.'
    }),

  telefono: Joi.string()
    .trim()
    .min(6)
    .max(15)
    .required()
    .messages({
      'string.empty': 'El teléfono es obligatorio.',
      'any.required': 'El teléfono es requerido.'
    }),

  especialista: Joi.string()
    .pattern(objectIdRegex)
    .required()
    .messages({
      'string.pattern.base': 'El ID del especialista no es válido.',
      'any.required': 'El especialista es requerido.'
    }),

  fecha: Joi.string()
    .pattern(fechaRegex)
    .required()
    .messages({
      'string.pattern.base': 'La fecha debe tener el formato YYYY-MM-DD.',
      'any.required': 'La fecha es requerida.'
    }),

  hora: Joi.string()
    .pattern(horaRegex)
    .required()
    .messages({
      'string.pattern.base': 'La hora debe tener el formato HH:MM.',
      'any.required': 'La hora es requerida.'
    })
});

// 🟡 Esquema para la ACTUALIZACIÓN de un Turno (Reprogramación o cambios de estado)
export const actualizarTurnoSchema = Joi.object({
  telefono: Joi.string().trim().min(6).max(15).optional(),
  especialista: Joi.string().pattern(objectIdRegex).optional(),
  fecha: Joi.string().pattern(fechaRegex).optional(),
  hora: Joi.string().pattern(horaRegex).optional(),
  qr: Joi.string().allow(null, '').optional(),
  estado: Joi.string().valid('pendiente', 'atendido', 'cancelado').optional().messages({
    'any.only': 'El estado debe ser: pendiente, atendido o cancelado.'
  })
});