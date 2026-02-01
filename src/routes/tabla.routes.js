import { Router } from "express";
import { obtenerTabla } from "../controllers/tabla/tabla.controller.js";

const router = Router();

router.get("/tabla",obtenerTabla)




export default router;