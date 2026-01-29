import { Router } from "express";
import { actualizarClubes, borrarClubes, crearClubes, obtenerClubes, obtenerClubesPorId } from "../controllers/clubes/clubesControllers.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.post('/clubes',upload.single('logo'),crearClubes)
router.get('/clubes',obtenerClubes)
router.get('/clubes/:id',upload.single('logo'),obtenerClubesPorId)
router.put('/clubes/:id',upload.single('logo'),actualizarClubes)
router.delete('/clubes/:id',borrarClubes)


export default router;