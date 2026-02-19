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
