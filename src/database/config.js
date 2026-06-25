import mongoose from 'mongoose';

// Guardamos la promesa de la conexión para evitar ejecuciones simultáneas
let cachedConnection = null;

export const dbConnect = async () => {
  // Si ya existe una conexión o una conexión en proceso, devolvemos esa misma promesa
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('Falta MONGODB_URI en las variables de entorno');

    console.log('=> Iniciando conexión a MongoDB...');

    // Guardamos la promesa en la variable estática
    cachedConnection = mongoose.connect(uri, {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
    });

    await cachedConnection;
    console.log('=> Nueva conexión exitosa a MongoDB');
    
    return cachedConnection;
  } catch (error) {
    // Si falla, limpiamos la caché para permitir re-intentos en la próxima petición
    cachedConnection = null;
    console.error('=> Error conectando a MongoDB:', error.message);
    throw error;
  }
};