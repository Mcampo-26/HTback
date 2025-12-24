import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import { turnosRouter } from "./src/routes/turnos/index.js";
import { noticiasRouter } from "./src/routes/noticias/index.js";
import { dbConnect } from "./src/database/config.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ░░░ CONFIGURACIÓN DE CORS ░░░
const allowedOrigins = [
  "http://localhost:5173",
  "https://hospitaldetrancas.netlify.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS bloqueado"));
    },
    credentials: true,
  })
);

// ░░░ SOCKET.IO ░░░
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.locals.io = io;

// ░░░ MIDDLEWARES BASE ░░░
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ░░░ CONTENT SECURITY POLICY ░░░
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",
    ].join("; ")
  );
  next();
});

// ░░░ RUTAS ░░░
app.use("/api/turnos", turnosRouter);
app.use("/api/noticias", noticiasRouter);

// ░░░ INICIAR SERVIDOR ░░░
const PORT = process.env.PORT || 8080;

server.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);

  // ✔️ SOLO en local mantenemos la conexión viva
  if (process.env.NODE_ENV !== "production") {
    await dbConnect();
    console.log("📦 Mongo conectado (local)");
  }
});
