import mongoose from "mongoose";
import partidos from "../../models/partidos";

export const crearPartido = async (req, res) => {
  try {
    const { local, visitante, fecha, hora } = req.body;
    if (!local || !visitante || !fecha || !hora) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(local) ||
      !mongoose.Types.ObjectId.isValid(visitante)
    ) {
      return res
        .status(400)
        .json({ message: "ID del local o visitante no valido" });
    }

    if (local === visitante) {
        return res
        .status(400)
        .json({ message: "El local y el visitante no pueden ser iguales" });
    }

    const [clubLocal, clubVisitante] = await Promise.all([
      Club.findById(local),
      Club.findById(visitante),
    ]);

    if (!clubLocal || !clubVisitante) {
      return res.status(404).json({
        message: "Uno o ambos clubes no existen",
      });
    }

    const nuevoPartido = new partidos({
      local,
      visitante,
      fecha,
      hora,
    });

    await nuevoPartido.save();

    res.status(201).json(nuevoPartido);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const obtenerPartidos = async (req, res) => {
    try {
        const { local, visitante, fecha, hora } = req.query;
        const filterQuery = {};

        if (local) filterQuery.local = local;
        if (visitante) filterQuery.visitante = visitante;
        if (fecha) filterQuery.fecha = fecha;
        if (hora) filterQuery.hora = hora;
    
        const partidoList = await partidos.find(filterQuery)
        .populate("local", "name logo colors")
        .populate("visitante", "name logo colors")
        .sort({ createdAt: -1 });
        res.status(200).json(partidoList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}