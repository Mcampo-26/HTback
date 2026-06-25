// src/database/config.js
import mongoose from 'mongoose';

// Cacheamos la promesa para evitar ejecuciones simultáneas en ráfagas de peticiones
let cachedPromise = null;

export const dbConnect = async () => {
  // 1. Si Mongoose ya está conectado de forma nativa (readyState 1 = conectado, 2 = conectando)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // 2. Si hay una promesa en proceso, la reutilizamos para no duplicar hilos
  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    // Usamos MONGODB_URI (o MONGO_URI, el que tengas configurado en tus variables de Heroku)
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('Falta la variable de conexión a MongoDB en el entorno');

    console.log('=> Iniciando conexión a MongoDB...');

    // 3. Opciones robustas del código que te andaba perfecto (Pool estable)
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    // Guardamos la promesa de conexión en la caché
    cachedPromise = mongoose.connect(uri, opts);

    const conn = await cachedPromise;
    console.log(`🚀 MongoDB: Conexión caliente y lista en ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    // Si falla, limpiamos la promesa cacheada para permitir que la siguiente petición reintente
    cachedPromise = null;
    console.error('❌ Error en la conexión a MongoDB:', error.message);
    throw error;
  }
};