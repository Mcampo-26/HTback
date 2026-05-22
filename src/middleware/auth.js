import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

// 🔒 Las credenciales idénticas a las que venías usando
const ADMIN_EMAIL = "admintrancas";
const ADMIN_PASSWORD = "admin123";
const JWT_SECRET = "clave_secreta_hospital_trancas_2026"; 

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validación exacta de tus datos habituales
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "2h" });

    return res.status(200).json({
      success: true,
      token,
      user: { name: "Administrador", email, role: "admin" }
    });
  }

  return res.status(401).json({ success: false, msg: "Email o contraseña incorrectos." });
});