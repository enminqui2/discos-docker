import mongoose from 'mongoose';

export async function conectarBD(uri) {
  if (!uri) {
    console.error('Falta la variable MONGODB_URI. Copia .env.example como .env y revísalo.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('No se pudo conectar a MongoDB:', err.message);
    console.error('¿Está arrancado el contenedor? Prueba con: docker compose up -d');
    process.exit(1);
  }

  // Cierra la conexión limpiamente al parar la aplicación (Ctrl+C)
  process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}
