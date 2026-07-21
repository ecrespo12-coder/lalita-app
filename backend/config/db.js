import dns from 'node:dns';
import mongoose from 'mongoose';

// El resolver DNS del sistema a veces falla al consultar registros SRV
// de MongoDB Atlas (comun en algunas redes/routers de Windows). Forzamos
// el uso de Google DNS solo para esta resolucion.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Falta la variable MONGODB_URI en el archivo .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB correctamente');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
}
