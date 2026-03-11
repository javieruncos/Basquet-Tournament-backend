import mongoose from "mongoose";
import partidos from "../../models/partidos.js";
import clubes from "../../models/clubes.js";
import { recalcularTablaService } from "../../services/tabla.services.js";
import { Jugador } from "../../models/jugador.js";
import { console } from "inspector";

export const crearPartido = async (req, res) => {
  console.log(req.body);
  try {
    const {
      local,
      visitante,
      fecha,
      hora,
      fase,
      estadio,
      jornada,
      arbitro1,
      arbitro2,
      arbitro3,
    } = req.body;

    if (
      !local ||
      !visitante ||
      !fecha ||
      !hora ||
      !fase ||
      !estadio ||
      !arbitro1 ||
      !arbitro2 ||
      !arbitro3 ||
      !jornada
    ) {
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
      estadio,
      arbitro1,
      arbitro2,
      arbitro3,
      fase,
      jornada,
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
    if (fecha) filterQuery.fecha = new Date(fecha);
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
  const {
    local,
    visitante,
    fecha,
    hora,
    estadio,
    arbitro1,
    arbitro2,
    arbitro3,
    fase,
    jornada,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }

  //  Validar solo si vienen

  if (local !== undefined && !mongoose.Types.ObjectId.isValid(local)) {
    return res.status(400).json({ message: "ID de local no válido" });
  }

  if (visitante !== undefined && !mongoose.Types.ObjectId.isValid(visitante)) {
    return res.status(400).json({ message: "ID de visitante no válido" });
  }

  if (local !== undefined && visitante !== undefined && local === visitante) {
    return res.status(400).json({
      message: "El local y el visitante no pueden ser iguales",
    });
  }

  //  Solo lo que venga
  const updateData = {};

  if (local !== undefined) updateData.local = local;
  if (visitante !== undefined) updateData.visitante = visitante;
  if (fecha !== undefined) updateData.fecha = fecha;
  if (hora !== undefined) updateData.hora = hora;
  if (estadio !== undefined) updateData.estadio = estadio;
  if (arbitro1 !== undefined) updateData.arbitro1 = arbitro1;
  if (arbitro2 !== undefined) updateData.arbitro2 = arbitro2;
  if (arbitro3 !== undefined) updateData.arbitro3 = arbitro3;
  if (fase !== undefined) updateData.fase = fase;
  if (jornada !== undefined) updateData.jornada = jornada;

  //  Evitar update vacío
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      message: "No se enviaron campos para actualizar",
    });
  }

  try {
    const partidoActualizado = await partidos
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
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
  console.log("BODY RECIBIDO:", req.body);
  const { id } = req.params;
  const { resultado, estadisticasJugadores, mvp, reabrir } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de partido no válido" });
  }

  if (!resultado || !resultado.cuartos) {
    return res.status(400).json({
      message: "Debe enviar resultado.cuartos",
    });
  }

  // ✅ Validar cuartos
  if (
    !Array.isArray(resultado.cuartos) ||
    resultado.cuartos.length !== 4 ||
    resultado.cuartos.some(
      (c) =>
        typeof c.local !== "number" ||
        typeof c.visitante !== "number" ||
        c.local < 0 ||
        c.visitante < 0,
    )
  ) {
    return res.status(400).json({
      message: "Cuartos inválidos",
    });
  }

  //  Calcular totales automáticamente
  const totalLocal = resultado.cuartos.reduce((acc, c) => acc + c.local, 0);
  const totalVisitante = resultado.cuartos.reduce(
    (acc, c) => acc + c.visitante,
    0,
  );

  //  Evitar empate (si tu torneo no lo permite)
  if (totalLocal === totalVisitante) {
    return res.status(400).json({
      message: "No se permiten empates",
    });
  }

  const resultadoFinal = {
    cuartos: resultado.cuartos,
    total: {
      local: totalLocal,
      visitante: totalVisitante,
    },
  };

  try {
    const partido = await partidos.findById(id);

    if (!partido) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    //  Evitar modificar partido ya finalizado
    if (partido.estado === "Finalizado" && !reabrir) {
      return res.status(400).json({
        message:
          "El partido ya está finalizado. Enviar { reabrir: true } para desbloquearlo",
      });
    }
    if (reabrir) partido.estado = "En juego";

    //  Determinar ganador
    const ganador =
      totalLocal > totalVisitante ? partido.local : partido.visitante;

    partido.resultado = resultadoFinal;
    partido.estado = "Finalizado";
    partido.ganador = ganador;

    //  MVP
    if (mvp) {
      if (!mongoose.Types.ObjectId.isValid(mvp)) {
        return res.status(400).json({ message: "MVP inválido" });
      }

      const jugadorMVP = await Jugador.findById(mvp);
      if (!jugadorMVP) {
        return res.status(404).json({ message: "Jugador MVP no encontrado" });
      }

      partido.mvp = jugadorMVP._id; // asignamos solo el ObjectId
    }

    //  Validar estadísticas por jugador
    // if (Array.isArray(estadisticasJugadores)) {
    //   const titularesLocal = estadisticasJugadores.filter(
    //     (j) => j.clubId.toString() === partido.local.toString() && j.titular === true,
    //   );

    //   const titularesVisitante = estadisticasJugadores.filter(
    //     (j) => j.clubId.toString() === partido.visitante.toString() && j.titular === true,
    //   );

    //   if (titularesLocal.length !== 5 || titularesVisitante.length !== 5) {
    //     return res.status(400).json({
    //       message: "Cada equipo debe tener exactamente 5 titulares",
    //     });
    //   }

    //   const statsValidas = estadisticasJugadores.every(
    //     (e) =>
    //       mongoose.Types.ObjectId.isValid(e.jugadorId) &&
    //       mongoose.Types.ObjectId.isValid(e.clubId) &&
    //       e.puntos >= 0 &&
    //       e.rebotes >= 0 &&
    //       e.asistencias >= 0 &&
    //       e.robos >= 0 &&
    //       e.tapones >= 0 &&
    //       e.minutos >= 0 &&
    //       e.faltas >= 0 &&
    //       e.perdidas >= 0,
    //   );

    //   if (!statsValidas) {
    //     return res.status(400).json({
    //       message: "Estadísticas de jugadores inválidas",
    //     });
    //   }

    //   partido.estadisticasJugadores = estadisticasJugadores;
    //   for (const est of estadisticasJugadores) {
    //     const jugador = await Jugador.findById(est.jugadorId);
    //     if (!jugador) {
    //       return res
    //         .status(404)
    //         .json({ message: `Jugador ${est.jugadorId} no encontrado` });
    //     }

    //     if (jugador.clubId.toString() !== est.clubId) {
    //       return res.status(400).json({
    //         message: `El jugador ${jugador.nombre} no pertenece al club ${est.clubId}`,
    //       });
    //     }

    //     if (jugador) {
    //       jugador.estadisticas.puntos += est.puntos || 0;
    //       jugador.estadisticas.rebotes += est.rebotes || 0;
    //       jugador.estadisticas.asistencias += est.asistencias || 0;
    //       jugador.estadisticas.robos += est.robos || 0;
    //       jugador.estadisticas.tapones += est.tapones || 0;
    //       jugador.estadisticas.perdidas += est.perdidas || 0;
    //       jugador.estadisticas.faltas += est.faltas || 0;
    //       jugador.estadisticas.minutos += est.minutos || 0;
    //       jugador.estadisticas.partidosJugados += 1;

    //       await jugador.save();
    //     }
    //   }
    // }

    if (Array.isArray(estadisticasJugadores) && estadisticasJugadores.length) {
      // ➖ Restar estadísticas anteriores
      if (partido.estadisticasJugadores?.length) {
        for (const estAnterior of partido.estadisticasJugadores) {
          const jugador = await Jugador.findById(estAnterior.jugadorId);

          if (jugador) {
            jugador.estadisticas.puntos -= estAnterior.puntos || 0;
            jugador.estadisticas.rebotes -= estAnterior.rebotes || 0;
            jugador.estadisticas.asistencias -= estAnterior.asistencias || 0;
            jugador.estadisticas.robos -= estAnterior.robos || 0;
            jugador.estadisticas.tapones -= estAnterior.tapones || 0;
            jugador.estadisticas.perdidas -= estAnterior.perdidas || 0;
            jugador.estadisticas.faltas -= estAnterior.faltas || 0;
            jugador.estadisticas.minutos -= estAnterior.minutos || 0;
            jugador.estadisticas.partidosJugados -= 1;

            await jugador.save();
          }
        }
      }

      // ➕ Guardar nuevas estadísticas
      partido.estadisticasJugadores = estadisticasJugadores;

      for (const est of estadisticasJugadores) {
        const jugador = await Jugador.findById(est.jugadorId);

        if (!jugador) {
          return res
            .status(404)
            .json({ message: `Jugador ${est.jugadorId} no encontrado` });
        }

        if (jugador.clubId.toString() !== est.clubId) {
          return res.status(400).json({
            message: `El jugador ${jugador.nombre} no pertenece al club ${est.clubId}`,
          });
        }

        jugador.estadisticas.puntos += est.puntos || 0;
        jugador.estadisticas.rebotes += est.rebotes || 0;
        jugador.estadisticas.asistencias += est.asistencias || 0;
        jugador.estadisticas.robos += est.robos || 0;
        jugador.estadisticas.tapones += est.tapones || 0;
        jugador.estadisticas.perdidas += est.perdidas || 0;
        jugador.estadisticas.faltas += est.faltas || 0;
        jugador.estadisticas.minutos += est.minutos || 0;
        jugador.estadisticas.partidosJugados += 1;

        await jugador.save();
      }
    }

    if (
      !mvp &&
      Array.isArray(estadisticasJugadores) &&
      estadisticasJugadores.length
    ) {
      const mejorJugador = estadisticasJugadores.reduce((prev, curr) => {
        const scorePrev =
          (prev.puntos || 0) + (prev.rebotes || 0) + (prev.asistencias || 0);
        const scoreCurr =
          (curr.puntos || 0) + (curr.rebotes || 0) + (curr.asistencias || 0);
        return scoreCurr > scorePrev ? curr : prev;
      });

      partido.mvp = mejorJugador.jugadorId;
    } else if (mvp) {
      // si envían mvp desde el front
      if (!mongoose.Types.ObjectId.isValid(mvp)) {
        return res.status(400).json({ message: "MVP inválido" });
      }
      const jugadorMVP = await Jugador.findById(mvp);
      if (!jugadorMVP) {
        return res.status(404).json({ message: "Jugador MVP no encontrado" });
      }
      partido.mvp = jugadorMVP._id;
    }

    await partido.save();

    //  Recalcular tabla
    await recalcularTablaService();

    const partidoActualizado = await partidos
      .findById(id)
      .populate("local", "name logo colors")
      .populate("visitante", "name logo colors")
      .populate("ganador", "name")
      .populate("mvp", "nombre numero");

    res.status(200).json(partidoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
