export const validateBody = (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, { 
        abortEarly: false, // Trae todos los errores juntos, no solo el primero
        stripUnknown: true // Elimina campos basura que manden en el body y no pertenezcan al esquema
      });
  
      if (error) {
        // Mapeamos los errores para devolver un array o un string amigable al frontend
        const errores = error.details.map(detail => detail.message);
        return res.status(400).json({ msg: errores[0], errores }); // Te dejo msg para mantener consistencia con tu front
      }
  
      // Pisamos el body con el valor sanitizado y formateado por Joi (ya con trim)
      req.body = value;
      next();
    };
  };