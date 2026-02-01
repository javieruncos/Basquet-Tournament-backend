import Tabla from "../../models/tabla.js";

export const obtenerTabla = async (req, res) => {
  try {
    const tabla = await Tabla.find()
      .populate("club", "name logo colors") // si querés datos del club
      .sort({ puntos: -1, diferencia: -1 });

    res.json(tabla);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




