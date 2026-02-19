import { Router } from "express";
import { crearJugador, eliminarJugador, obtenerJugadores } from "../controllers/jugadores/jugadores.controller.js";

const router = Router();


router.post("/jugadores",crearJugador)
router.get("/jugadores",obtenerJugadores)
router.delete("/jugadores/:id",eliminarJugador)

export default router;