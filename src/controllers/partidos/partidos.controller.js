import mongoose from "mongoose";
import partidos from "../../models/partidos.js";
import clubes from "../../models/clubes.js";

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
      clubes.findById(local),
      clubes.findById(visitante),
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
    console.error("ERROR CREAR PARTIDO:", error);
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

    const partidoList = await partidos
      .find(filterQuery)
      .populate("local", "name logo colors")
      .populate("visitante", "name logo colors")
      .sort({ createdAt: -1 });
    res.status(200).json(partidoList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPartidoPorId = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }

  try {
    const partido = await partidos
      .findById(id)
      .populate("local", "name logo colors")
      .populate("visitante", "name logo colors");

    if (!partido) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    res.status(200).json(partido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarPartido = async (req, res) => {
  const { id } = req.params;
  const { local, visitante, fecha, hora } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }

  if (!local || !visitante || !fecha || !hora) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(local) ||
    !mongoose.Types.ObjectId.isValid(visitante)
  ) {
    return res.status(400).json({ message: "ID de club no válido" });
  }

  if (local === visitante) {
    return res
      .status(400)
      .json({ message: "El local y el visitante no pueden ser iguales" });
  }

  const updateData = {
    local,
    visitante,
    fecha,
    hora,
  };

  try {
    const partidoActualizado = await partidos
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("local", "name logo colors")
      .populate("visitante", "name logo colors");

    if (!partidoActualizado) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    res.status(200).json(partidoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const borrarPartido = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }

  try {
    const resultado = await partidos.findByIdAndDelete(id);
    if (!resultado)
      return res.status(404).json({ message: "No se encontro el partido" });

    res.status(200).json({ message: "Partido eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarResultado = async (req, res) => {
  //recuperamos el id de la request
  const { id } = req.params;
  //extraemos el resultado y estodo del body
  const { resultado, estado } = req.body;

  //verificamos que el id del partido sea valido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de club no válido" });
  }

  //validamos que los campos local y visitante sean numeros 
  if (
    typeof resultado.total.local !== "number" ||
    typeof resultado.total.visitante !== "number" ||
    resultado.total.local < 0 ||
    resultado.total.visitante < 0
  ) {
    return res.status(400).json({ message: "El resultado invalido" });
  }

  //validomos que el resultado cuartos sea un array
  if (resultado.cuartos) {
    if (
      //validamos que sea un array
      !Array.isArray(resultado.cuartos) ||
      //validamos que sea de 4 elementos
      resultado.cuartos.length !== 4 ||
      //validamos que sea un objeto con las propiedades correctas
      resultado.cuartos.some(
        (c) =>
          typeof c.local !== "number" ||
          typeof c.visitante !== "number" ||
          c.local < 0 ||
          c.visitante < 0,
      )
    ) {
      return res
        .status(400)
        .json({ message: "Resultados por cuartos inválidos" });
    }
  }
  //validamos que el array exista
  if (resultado.cuartos) {
    //sumamos el resultado de los 4 cuartos del partido
    const sumaLocal = resultado.cuartos.reduce((acc, c) => acc + c.local, 0);
    //sumamos el resultado de los 4 cuartos del partido
    const sumaVisitante = resultado.cuartos.reduce(
      (acc, c) => acc + c.visitante,
      0,
    );

    //validamos que las sumas de los cuartos coincida con el resultado total
    if (
      sumaLocal !== resultado.total.local ||
      sumaVisitante !== resultado.total.visitante
    ) {
      return res.status(400).json({
        message: "La suma de cuartos no coincide con el resultado total",
      });
    }
  }

  try {
    const partido = await partidos.findById(id);

    if (!partido) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    partido.resultado = resultado;
    partido.estado = "Finalizado";


    await partido.save();

    const partidoActualizado = await partidos
      .findById(id)
      .populate("local", "name logo colors")
      .populate("visitante", "name logo colors");

    res.status(200).json(partidoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
