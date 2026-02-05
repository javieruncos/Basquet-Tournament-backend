import { Router } from "express";
import { actualizarPartido, actualizarResultado, borrarPartido, crearPartido, obtenerPartidoPorId, obtenerPartidos } from "../controllers/partidos/partidos.controller.js";
import { verifyAdmin, verifyTokenAuth } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/partidos",verifyTokenAuth,verifyAdmin,crearPartido)
router.get("/partidos",obtenerPartidos)
router.get("/partidos/:id",obtenerPartidoPorId)
router.put("/partidos/:id",verifyTokenAuth,verifyAdmin,actualizarPartido)
router.delete("/partidos/:id",verifyTokenAuth,verifyAdmin,borrarPartido)
router.put("/partidos/:id/resultado",verifyTokenAuth,verifyAdmin,actualizarResultado)





export default router;