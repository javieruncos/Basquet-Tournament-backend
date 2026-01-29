import { Router } from "express";
import { crearPartido } from "../controllers/partidos/partidos.controller";

const router = Router();

router.post("/partidos",crearPartido)


export default router;