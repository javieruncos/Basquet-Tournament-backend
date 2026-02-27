import { Router } from "express";
import { actualizarPartido, actualizarResultado, borrarPartido, crearPartido, obtenerPartidoPorId, obtenerPartidos } from "../controllers/partidos/partidos.controller.js";
import { verifyAdmin, verifyTokenAuth } from "../middlewares/verifyToken.js";
import { validatePartido, validatePartidoUpdate, validateResultado } from "../validators/partidosValidate.js";
import { validate } from "../middlewares/validations.js";

const router = Router();

// router.post("/partidos",verifyTokenAuth,verifyAdmin,validatePartido,validate,crearPartido)
router.post("/partidos",validatePartido,validate,crearPartido)
router.get("/partidos",obtenerPartidos)
router.get("/partidos/:id",obtenerPartidoPorId)
// router.put("/partidos/:id",verifyTokenAuth,verifyAdmin,validatePartidoUpdate,validate,actualizarPartido)
// router.put("/partidos/:id",validatePartidoUpdate,validate,actualizarPartido)
router.put("/partidos/:id",validate,actualizarPartido)
// router.delete("/partidos/:id",verifyTokenAuth,verifyAdmin,borrarPartido)
router.delete("/partidos/:id",borrarPartido)
// router.put("/partidos/:id/resultado",verifyTokenAuth,verifyAdmin,validateResultado,validate,actualizarResultado)
router.put("/partidos/:id/resultado",validateResultado,validate,actualizarResultado)





export default router;