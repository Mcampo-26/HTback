import mongoose from 'mongoose';

// Variable para guardar la conexión en la memoria de la función de Vercel
let isConnected = false;

export const dbConnect = async () => {
  // Si ya estamos conectados, no hacemos nada y salimos rápido
  if (isConnected) {
    console.log('=> Usando conexión existente');
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('La URI de conexión no está definida en las variables de entorno');
    }

    console.log('=> Creando nueva conexión a MongoDB...');
    
    // Configuraciones recomendadas para evitar que la conexión se cuelgue
    const db = await mongoose.connect(uri, {
      bufferCommands: false, // Falla rápido si no hay conexión
      serverSelectionTimeoutMS: 5000, // No esperes más de 5 segundos
    });

    isConnected = db.connections[0].readyState;
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
    // No lances el error aquí para evitar que el backend se reinicie infinitamente
  }
};