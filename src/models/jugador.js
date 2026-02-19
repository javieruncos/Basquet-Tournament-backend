import mongoose from "mongoose";

export const jugadorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    posicion: {
      type: String,
      enum: ["Base", "Escolta", "Alero", "Ala-Pivot", "Pivot"],
      required: true,
    },
    numero: { type: Number, required: true },
    edad: { type: Number, required: true },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clubes",
      required: true,
    },
    image: {
      url: { type: String},
      public_id: { type: String},
    },
    estadisticas: {
      puntos: { type: Number, default: 0 },
      rebotes: { type: Number, default: 0 },
      asistencias: { type: Number, default: 0 },
      robos: { type: Number, default: 0 },
      tapones: { type: Number, default: 0 },
      partidosJugados: { type: Number, default: 0 },
      minutos: { type: Number, default: 0 },
      faltas: { type: Number, default: 0 },
      perdidas: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

jugadorSchema.index({ clubId: 1, numero: 1 }, { unique: true });

export const Jugador = mongoose.model("Jugador", jugadorSchema);
