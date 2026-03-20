import clubes from "../../models/clubes.js";
import { Jugador } from "../../models/jugador.js";
import mongoose from "mongoose";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const crearJugador = async (req, res) => {
  const { nombre, posicion, numero, edad, clubId } = req.body;

  if (!nombre || !posicion || !numero || !edad || !clubId) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  if (!mongoose.Types.ObjectId.isValid(clubId)) {
    return res.status(400).json({ message: "ID de club inválido" });
  }

  const numeroNum = Number(numero);

  if (isNaN(numeroNum) || numeroNum < 0 || numeroNum > 99) {
    return res.status(400).json({
      message: "Número de camiseta inválido",
    });
  }

  try {
    const club = await clubes.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: "Club no encontrado" });
    }

    const existeJugador = await Jugador.findOne({ numero, clubId });

    if (existeJugador) {
      return res
        .status(400)
        .json({ message: "Ya existe un jugador con ese número en este club" });
    }

    let imageData = null

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "jugadores",
      });

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // 🧹 Borrar archivo local
      fs.unlinkSync(req.file.path);
    }

    const nuevoJugador = new Jugador({
      nombre,
      posicion,
      numero,
      edad,
      clubId,
     ...(imageData && { image: imageData }),
    });

    await nuevoJugador.save();
    res.status(201).json(nuevoJugador);

  } catch (error) {

     if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Número de jugador ya registrado en este club",
      });
    }

    res.status(500).json({ message: error.message });
  }
};


export const obtenerJugadores = async (req, res) => {
  try {
    const { clubId } = req.query;

    const filter = {};
    if (clubId) filter.clubId = clubId;

    const jugadores = await Jugador.find(filter)
      .populate("clubId", "nombre")
      .sort({ nombre: 1 });

    res.status(200).json(jugadores);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarJugador = async (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de jugador no válido" });
  }

  try {
    const jugador = await Jugador.findById(id);

    if (!jugador) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    await jugador.deleteOne();

    res.status(200).json({ message: "Jugador eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerTop5Jugadores = async (req, res) => {
  try {
    const top5 = await Jugador.aggregate([
      {
        $addFields: {
          eficiencia: {
            $subtract: [
              {
                $add: [
                  "$estadisticas.puntos",
                  "$estadisticas.rebotes",
                  "$estadisticas.asistencias",
                  "$estadisticas.robos",
                  "$estadisticas.tapones",
                ],
              },
              "$estadisticas.perdidas",
            ],
          },
        },
      },
      { $sort: { eficiencia: -1 } },
      { $limit: 5 },
      {
        $project: {
          nombre: 1,
          numero: 1,
          clubId: 1,
          estadisticas: 1,
          eficiencia: 1,
        },
      },
    ]);

    res.status(200).json(top5);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};