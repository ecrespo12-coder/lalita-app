import mongoose from 'mongoose';

// Categorias predeterminadas de Lalita (el usuario puede enviar otras igual,
// pero estas son las sugeridas en la propuesta original)
export const CATEGORY_LIST = [
  'Medicamentos',
  'Terapia',
  'Comida',
  'Ejercicio',
  'Arte',
  'Autocuidado',
  'Reflexion',
  'Aprendizaje',
  'Afirmacion',
  'Otro'
];

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String, // formato 'YYYY-MM-DD', mas simple de filtrar y ordenar
      required: true,
      index: true
    },
    time: {
      type: String, // formato 'HH:MM' opcional, para la alarma/recordatorio
      default: ''
    },
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#6A8FD9'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
