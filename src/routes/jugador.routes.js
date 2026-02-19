import { Router } from "express";
import { crearJugador } from "../controllers/jugadores/jugadores.controller.js";

const router = Router();


router.post("/jugadores",crearJugador)


export default router;