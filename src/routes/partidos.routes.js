import { Router } from "express";
import { actualizarPartido, actualizarResultado, borrarPartido, crearPartido, obtenerPartidoPorId, obtenerPartidos } from "../controllers/partidos/partidos.controller.js";

const router = Router();

router.post("/partidos",crearPartido)
router.get("/partidos",obtenerPartidos)
router.get("/partidos/:id",obtenerPartidoPorId)
router.put("/partidos/:id",actualizarPartido)
router.delete("/partidos/:id",borrarPartido)
router.put("/partidos/:id/resultado",actualizarResultado)





export default router;