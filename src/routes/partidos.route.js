import { Router } from "express";
import { actualizarPartido, crearPartido, obtenerPartidoPorId, obtenerPartidos } from "../controllers/partidos/partidos.controller";

const router = Router();

router.post("/partidos",crearPartido)
router.get("/partidos",obtenerPartidos)
router.get("/partidos/:id",obtenerPartidoPorId)
router.put("/partidos/:id",actualizarPartido)




export default router;