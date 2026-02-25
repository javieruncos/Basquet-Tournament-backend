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
    estadio: { type: String, default: null },
    jornada: { type: Number, default: null },
    fase: {
      type: String,
      enum: ["Regular", "Octavos", "Cuartos", "Semifinal", "Final"],
      default: "Regular",
    },
    arbitro1: { type: String, default: null },
    arbitro2: { type: String, default: null },
    arbitro3: { type: String, default: null },
    estado: {
      type: String,
      enum: ["Programado", "En juego", "Finalizado", "Cancelado", "Suspendido"],
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
    ganador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clubes",
      default: null,
    },
    mvp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jugador",
      default: null,
    },
    estadisticasJugadores: [
      {
        jugadorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Jugadores",
          required: true,
        },

        clubId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Clubes",
          required: true,
        },
        titular: { type: Boolean, default: false },
        puntos: { type: Number, default: 0 },
        rebotes: { type: Number, default: 0 },
        asistencias: { type: Number, default: 0 },
        robos: { type: Number, default: 0 },
        tapones: { type: Number, default: 0 },
        minutos: { type: Number, default: 0 },
        faltas: { type: Number, default: 0 },
        perdidas: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Partidos", partidoSchema);
