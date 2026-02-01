import Tabla from "../models/tabla.js";
import partidos from "../models/partidos.js";

const crearFilaBase = (clubId) => ({
  club: clubId,
  jugados: 0,
  ganados: 0,
  perdidos: 0,
  puntosFavor: 0,
  puntosContra: 0,
  diferencia: 0,
  puntos: 0,
});

export const recalcularTablaService = async () => {
  await Tabla.deleteMany({});

  const partidosFinalizados = await partidos.find({
    estado: "Finalizado",
  });

  const tabla = {};

  for (const p of partidosFinalizados) {
    const localId = p.local.toString();
    const visitanteId = p.visitante.toString();

    if (!tabla[localId]) tabla[localId] = crearFilaBase(localId);
    if (!tabla[visitanteId]) tabla[visitanteId] = crearFilaBase(visitanteId);

    const pl = p.resultado.total.local;
    const pv = p.resultado.total.visitante;

    tabla[localId].jugados++;
    tabla[visitanteId].jugados++;

    tabla[localId].puntosFavor += pl;
    tabla[localId].puntosContra += pv;

    tabla[visitanteId].puntosFavor += pv;
    tabla[visitanteId].puntosContra += pl;

    if (pl > pv) {
      tabla[localId].ganados++;
      tabla[localId].puntos += 2;
      tabla[visitanteId].perdidos++;
      tabla[visitanteId].puntos += 1;
    } else {
      tabla[visitanteId].ganados++;
      tabla[visitanteId].puntos += 2;
      tabla[localId].perdidos++;
      tabla[localId].puntos += 1;
    }
  }

  const filas = Object.values(tabla).map(f => {
    f.diferencia = f.puntosFavor - f.puntosContra;
    return f;
  });

  await Tabla.insertMany(filas);

  return filas.length;
};