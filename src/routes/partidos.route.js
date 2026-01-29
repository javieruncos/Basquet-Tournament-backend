import { Router } from "express";
import { crearPartido, obtenerPartidos } from "../controllers/partidos/partidos.controller";

const router = Router();

router.post("/partidos",crearPartido)
router.get("/partidos",obtenerPartidos)


export default router;