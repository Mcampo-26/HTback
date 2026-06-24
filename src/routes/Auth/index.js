import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

// Tus credenciales fijas de administración
const ADMIN_EMAIL = "admintrancas";
const ADMIN_PASSWORD = "admin123";

// 🔓 1. Loguear Administrador
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // 🔥 FIRMA UNIFICADA: Ahora lee la clave desde tu archivo .env
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "2h" });

    return res.status(200).json({
      success: true,
      token,
      user: { name: "Administrador", email, role: "admin" }
    });
  }

  return res.status(401).json({ success: false, msg: "Usuario o contraseña incorrectos" });
});

// 🔐 2. Middleware para verificar Sesión (Token JWT)
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || token === "undefined") {
    return res.status(403).json({ 
      success: false, 
      msg: "Acceso denegado: Token inexistente en la cabecera." 
    });
  }

  try {
    // 🔥 VERIFICACIÓN UNIFICADA: Compara contra la misma clave del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error de validación JWT:", error.message);
    return res.status(401).json({ 
      success: false, 
      msg: "Sesión inválida o expirada. Por favor, ingresá de nuevo." 
    });
  }
};

// 📝 3. Middleware para validar esquemas de Joi en el Body
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false, 
      stripUnknown: true 
    });

    if (error) {
      const errores = error.details.map(detail => detail.message);
      return res.status(400).json({ msg: errores[0], errores }); 
    }

    req.body = value;
    next();
  };
};