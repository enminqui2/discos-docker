import mongoose from 'mongoose';

const discoSchema = new mongoose.Schema(
  {
    grupo: {
      type: String,
      required: [true, 'El grupo es obligatorio.'],
      trim: true,
      maxlength: [100, 'El grupo no puede superar los 100 caracteres.'],
    },
    nombre_disco: {
      type: String,
      required: [true, 'El nombre del disco es obligatorio.'],
      trim: true,
      maxlength: [150, 'El nombre del disco no puede superar los 150 caracteres.'],
    },
    portada_disco: {
      type: String,
      required: [true, 'La portada es obligatoria.'],
      trim: true,
      // Solo URLs http/https (evita, por ejemplo, "javascript:...")
      match: [/^https?:\/\/\S+$/i, 'La portada debe ser una URL que empiece por http:// o https://'],
    },
  },
  {
    collection: 'discos', // colección "discos" dentro de la BD "discos"
    timestamps: true, // añade createdAt y updatedAt
    versionKey: false, // sin el campo __v
  },
);

export default mongoose.model('Disco', discoSchema);
