import mongoose from "mongoose";

const tablaSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    ref: "Clubes",
    required: true,
    unique: true,
  },
  jugados: { type: Number, default: 0 },
  ganados: { type: Number, default: 0 },
  perdidos: { type: Number, default: 0 },
  puntosFavor: { type: Number, default: 0 },
  puntosContra: { type: Number, default: 0 },
  diferencia: { type: Number, default: 0 },
  puntos: { type: Number, default: 0 },
},
{
  timestamps: true,
});

export default mongoose.model("Tabla", tablaSchema);
