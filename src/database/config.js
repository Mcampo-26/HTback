import mongoose from 'mongoose';

let isConnected = false;

export const dbConnect = async () => {
  // Si ya hay una conexión activa, retornamos inmediatamente (0 ms de espera)
  if (isConnected) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('Falta MONGODB_URI en las variables de entorno');

    // Configuraciones para Serverless (Vercel)
    const db = await mongoose.connect(uri, {
      bufferCommands: true, // Permite que Mongoose espere la conexión antes de fallar
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState;
    console.log('=> Nueva conexión exitosa a MongoDB');
  } catch (error) {
    console.error('=> Error conectando a MongoDB:', error.message);
    throw error; // Lanzamos el error para que el middleware lo capture
  }
};