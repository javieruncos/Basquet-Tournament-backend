import mongoose from "mongoose";

const partidoSchema = new mongoose.Schema(
  {
    local: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Clubes",
    },
    visitante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Clubes",
    },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Programado", "En juego", "Finalizado"],
      default: "Programado",
    },
    resultado: {
      cuartos: [
        {
          local: { type: Number, default: 0 },
          visitante: { type: Number, default: 0 },
        },
      ],
      total: {
        local: { type: Number, default: 0 },
        visitante: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Partidos", partidoSchema);
