import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { turnosRouter } from "./src/routes/turnos/index.js";

import { dbConnect } from './src/database/config.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);

// ░░░ CONFIGURACIÓN DE CORS ░░░
const allowedOrigins = ['http://localhost:5173','https://webht-912ff4af7bbc.herokuapp.com'];

app.use(cors({
  origin: function(origin, callback){
    // Permite requests sin origin (ej: desde Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log("CORS rechazado para:", origin);
    return callback(new Error('CORS bloqueado'));
  },
  credentials: true
}));

// ░░░ SOCKET.IO ░░░
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.locals.io = io;

// ░░░ MIDDLEWARES BASE ░░░
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ░░░ RUTAS ░░░
app.use("/api/turnos", turnosRouter);
// ░░░ INICIAR SERVIDOR ░░░
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// ░░░ CONEXIÓN A MONGODB ░░░
dbConnect()
  .then(() => console.log('📦 Base de datos conectada'))
  .catch((err) => console.error('❌ Error de conexión DB:', err));
