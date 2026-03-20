import { Router } from "express";
import { crearJugador, eliminarJugador, obtenerJugadores, obtenerTop5Jugadores } from "../controllers/jugadores/jugadores.controller.js";

const router = Router();


router.post("/jugadores",crearJugador)
router.get("/jugadores",obtenerJugadores)
router.get("/jugadores/top5",obtenerTop5Jugadores)
router.delete("/jugadores/:id",eliminarJugador)

export default router;