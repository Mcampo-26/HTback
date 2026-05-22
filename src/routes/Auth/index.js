import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

// Tus mismas credenciales del frontend, pero resguardadas de forma segura en el servidor
const ADMIN_EMAIL = "admintrancas";
const ADMIN_PASSWORD = "admin123";
const JWT_SECRET = "clave_secreta_hospital_trancas_2026"; // Usa una palabra clave aleatoria

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Generamos un token firmado real que expira en 2 horas
    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "2h" });

    return res.status(200).json({
      success: true,
      token,
      user: { name: "Administrador", email, role: "admin" }
    });
  }

  return res.status(401).json({ success: false, msg: "Usuario o contraseña incorrectos" });
});