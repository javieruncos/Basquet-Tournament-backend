import { Router } from "express";
import { actualizarClubes, borrarClubes, crearClubes, obtenerClubes, obtenerClubesPorId } from "../controllers/clubes/clubesControllers.js";

const router = Router();

router.post('/clubes',crearClubes)
router.get('/clubes',obtenerClubes)
router.get('/clubes/:id',obtenerClubesPorId)
router.put('/clubes/:id',actualizarClubes)
router.delete('/clubes/:id',borrarClubes)


export default router;